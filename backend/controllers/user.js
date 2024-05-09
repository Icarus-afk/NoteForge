import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mongoose } from "mongoose";
import UserModel from "../models/user.js";
import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import logger from '../utils/consoleLogger.js'
// import redisClient from '../utils//initRedis.js';
import { generateToken } from "../utils/generateToken.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import os from 'os';
import fs from 'fs';

dotenv.config();


const secret = process.env.JWT_SECRET;
const __dirname = dirname(fileURLToPath(import.meta.url));
const storage = new Storage({
  keyFilename: path.join(__dirname, 'keyfile.json'),
  projectId: process.env.PROJECT_ID
});

const bucket = storage.bucket(process.env.BUCKET);



export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    logger.info(`Signin attempt for email: ${email}`);
    const oldUser = await UserModel.findOne({ email });

    if (!oldUser) {
      logger(`User doesn't exist for email: ${email}`);
      return res.status(404).json({ code: 404, success: false, message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      logger.info(`Invalid credentials for email: ${email}`);
      return res.status(400).json({ code: 400, success: false, message: "Invalid credentials" });
    }

    const token = generateToken(oldUser.email, oldUser._id, secret, "1h");
    console.log("Token -->", token);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
    });

    // const refreshToken = jwt({ id: oldUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    if (oldUser.userImage) {
      const bucket = storage.bucket(process.env.BUCKET);
      const fileName = oldUser.userImage.split('/').pop();
      const filePath = `profile_pics/${oldUser._id}/${fileName}`;
      const file = bucket.file(filePath);
      const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
      await file.download({ destination: tempFilePath });

      // Read the image file as binary data
      let imageData = fs.readFileSync(tempFilePath);

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);
      oldUser.userImage = imageData.toString('base64');
    }
    logger.info(`User signed in successfully for email: ${email}`);
    res.status(200).json({ code: 200, success: true, message: "Signed in successfully", data: { result: oldUser } });
  } catch (err) {
    logger.error(`Signin error for email: ${email}`, err);
    res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
  }
};



export const signup = async (req, res) => {
  const { email, password, firstName, lastName, isAdmin, isOrganizer, dateOfBirth, address, phoneNumber, bio, interests, organizations } = req.body;
  const userImage = req.file;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ code: 400, success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    const pendingUser = {
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      isAdmin: isAdmin || false,
      isActive: true,
      status: 'pending',
      dateOfBirth,
      address,
      phoneNumber,
      bio,
      interests,
      joinedAt: new Date(),
    };

    const result = await UserModel.create(pendingUser);

    if (userImage) {
      const uniqueFileName = userImage.originalname;
      const blob = bucket.file(`profile_pics/${result._id}/${uniqueFileName}`);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        console.error('blobStream error:', err);
        throw err;
      });

      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        pendingUser.userImage = publicUrl;

        await UserModel.updateOne({ _id: result._id }, { userImage: publicUrl, status: 'active' });

        const token = generateToken(result.email, result._id, secret, "1h");

        const user = await UserModel.findById(result._id).select('-password');

        res.status(201).json({ code: 201, success: true, message: "User signed up successfully", user: user });
      });

      blobStream.end(userImage.buffer);
    } else {
      await UserModel.updateOne({ _id: result._id }, { status: 'active' });

      const token = generateToken(result.email, result._id, secret, "1h");

      const user = await UserModel.findById(result._id).select('-password');

      res.status(201).json({ code: 201, success: true, message: "User signed up successfully", user: user });
    }
  } catch (err) {
    logger.error(`Signup error for email: ${email}`, err);
    res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
  }
};



export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dateOfBirth, address, phoneNumber, bio, interests, joinedAt, organizations } = req.body;
  const userImage = req.file;

  logger.info(`Update user attempt for id: ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`Invalid id: ${id}`);
    return res.status(404).json({ code: 404, success: false, message: `No user with id: ${id}` });
  }

  try {
    const existingUser = await UserModel.findById(id);

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found', statusCode: 404 });
    }

    let publicUrl = existingUser.userImage;

    if (userImage) {
      if (existingUser.userImage) {
        const oldFile = bucket.file(`profile_pics/${id}/${existingUser.userImage.split('/').pop()}`);
        await oldFile.delete();
      }

      const blob = bucket.file(`profile_pics/${id}/${userImage.originalname}`);

      publicUrl = await new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
          reject(err);
        });

        blobStream.on('finish', async () => {
          const newUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(newUrl);
        });

        blobStream.end(userImage.buffer);
      });
    }

    const updatedUser = { name: `${firstName} ${lastName}`, dateOfBirth, address, phoneNumber, userImage: publicUrl, bio, interests, joinedAt, organizations, _id: id };
    const updatedUserResult = await UserModel.findByIdAndUpdate(id, updatedUser, { new: true });
    const updatedUserWithoutPassword = await UserModel.findById(updatedUserResult._id).select('-password -__v');
    updatedUserWithoutPassword._doc.userImage = updatedUser.userImage;
    res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUserWithoutPassword, statusCode: 200 });
    logger.info(`User updated successfully for id: ${id}`);
  } catch (error) {
    logger.error(`Update user error for id: ${id}`, error);
    res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
  }
};



export const deleteUser = async (req, res) => {
  const { id } = req.params;

  logger.info(`Delete user attempt for id: ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`Invalid id: ${id}`);
    return res.status(404).json({ code: 404, success: false, message: `No user with id: ${id}` });
  }

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      logger.info(`User not found for id: ${id}`);
      return res.status(404).json({ code: 404, success: false, message: `User not found` });
    }

    if (user.userImage) {
      const fileName = encodeURIComponent(user.userImage.split('/').pop());
      const filePath = `profile_pics/${id}/${fileName}`;
      const file = bucket.file(filePath);
      const [exists] = await file.exists();

      if (exists) {
        try {
          await file.delete();
        } catch (error) {
          logger.error(`Error deleting image for user id: ${id}`, error);
        }
      }
    }

    await UserModel.findByIdAndDelete(id);

    logger.info(`User deleted successfully for id: ${id}`);
    res.json({ code: 200, success: true, message: "User deleted successfully." });
  } catch (error) {
    logger.error(`Delete user error for id: ${id}`, error);
    res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
  }
};



// export const getUserDetails = async (req, res) => {
//   const { id } = req.params;

//   try {
//     let userDetails = await redisClient.get(`user:${id}`);

//     if (!userDetails) {
//       userDetails = await UserModel.findOne({ _id: id }).select('-password');

//       if (!userDetails) {
//         return res.status(404).json({ code: 404, success: false, message: "User not found" });
//       }
//       await redisClient.setex(`user:${userDetails.name}`, 3600, JSON.stringify(userDetails));
//     } else {
//       userDetails = JSON.parse(userDetails);
//     }

//     res.status(200).json({ code: 200, success: true, data: userDetails });
//   } catch (err) {
//     logger.error
//     res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
//   }
// };



export const refreshToken = async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(403).json({ success: false, message: 'Refresh token is required', code: 403 });
  }

  try {
    const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await UserModel.findById(userData.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', code: 404 });
    }

    const token = generateToken(user._id, process.env.JWT_SECRET, '1h');

    // res.cookie('accessToken', token, { httpOnly: true, secure: true });
    // res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
    res.status(200).json({ success: true, message: 'Token refreshed successfully', accessToken: token, code: 200 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error', code: 500 });
  }
};



export const verifyToken = async (req, res) => {
  console.log('Verifying token');

  const token = req.cookies.token;

  if (token) {
    console.log('Token found in cookies');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Error verifying token:', err);
        return res.sendStatus(403);
      }

      console.log('Token verified successfully');
      res.sendStatus(200);
    });
  } else {
    console.log('No token found in cookies');
    res.sendStatus(401);
  }
};