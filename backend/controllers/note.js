import { Storage } from '@google-cloud/storage';
import Note from '../models/note.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { URL } from 'url';
import os from 'os';
import fs from 'fs';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = new Storage({
  keyFilename: path.join(__dirname, 'keyfile.json'),
  projectId: process.env.PROJECT_ID
});

const bucket = storage.bucket(process.env.BUCKET);

const generateUniqueFileName = async (user, originalname) => {
  let nameParts = originalname.split('.');
  let extension = nameParts.pop();
  let baseName = nameParts.join('.');
  let newFileName = originalname;
  let counter = 1;

  while (await bucket.file(`${user}/${newFileName}`).exists()[0]) {
    newFileName = `${baseName}(${counter}).${extension}`;
    counter++;
  }

  return newFileName;
};


export const createNote = async (req, res, next) => {
  console.log('createNote called');

  const { title } = req.body;
  const userId = req.user._id; // Get user ID from req.user
  console.log('title:', title, 'user:', userId);

  console.log(req.file)

  const { originalname } = req.file;
  console.log('originalname:', originalname);

  const uniqueFileName = originalname; 
  const blob = bucket.file(`${userId}/${uniqueFileName}`);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    console.error('blobStream error:', err);
    next(err);
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    console.log('publicUrl:', publicUrl);

    const newNote = new Note({
      title,
      FileUrl: publicUrl,
      user: new mongoose.Types.ObjectId(userId),
    });

    newNote.save()
      .then(() => {
        console.log('Note saved successfully');
        res.status(200).json({
          status: 'success',
          code: 200,
          message: 'Note saved successfully',
          data: newNote
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({
          status: 'error',
          code: 500,
          message: 'An error occurred while saving the note',
          data: null
        });
      });
  });

  blobStream.end(req.file.buffer);
};



export const getNotes = async (req, res) => {
  console.log("USER ---> ", req.userId)
  const notes = await Note.find({ user: req.userId });
  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'Notes fetched successfully',
    data: notes
  });
};



export const updateNote = async (req, res) => {
  const { title } = req.body;
  const user = req.user._id;
  const { originalname } = req.file;

  try {
    // Fetch the note to be updated
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: 'not found',
        code: 404,
        message: 'Note not found',
        data: null
      });
    }

    // Delete the old file from the bucket
    const oldFile = bucket.file(`${user}/${note.FileUrl.split('/').pop()}`);
    await oldFile.delete();

    // Upload the new file to the bucket
    const blob = bucket.file(`${user}/${originalname}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      res.status(500).send({ message: 'Error uploading file', error: err });
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // Update the note
      note.title = title;
      note.FileUrl = publicUrl;
      const updatedNote = await note.save();

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Note updated successfully',
        data: updatedNote
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Error updating note',
      data: null,
    });  }
};


export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      status: 'not found',
      code: 404,
      message: 'Note not found',
      data: null
    });
  }

  if (!note.FileUrl) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Note does not have a FileUrl',
      data: null
    });
  }

  console.log('FileUrl:', note.FileUrl);

  const urlParts = note.FileUrl.split('/');
  const bucketName = 'forge_md';
  const bucketNameIndex = urlParts.indexOf(bucketName);

  if (bucketNameIndex === -1) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Invalid FileUrl',
      data: null
    });
  }

  let filePath = urlParts.slice(bucketNameIndex + 1).join('/');

  filePath = filePath.replace(bucketName + '/', '');

  console.log('filePath:', filePath);

  const file = bucket.file(filePath);

  await file.delete();
  await Note.deleteOne({ _id: req.params.id });

  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'Note deleted successfully',
    data: null
  });
};



export const getFile = async (req, res) => {
  console.log("Getting file")
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).json({
      status: 'fail',
      code: 404,
      message: 'Note not found',
    });
  }

  const bucket = storage.bucket('forge_md');

  const urlParts = note.FileUrl.split('/');
  const bucketNameIndex = urlParts.indexOf('forge_md');

  if (bucketNameIndex === -1) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Invalid FileUrl',
      data: null
    });
  }

  let filePath = urlParts.slice(bucketNameIndex + 1).join('/');
  filePath = filePath.replace('forge_md/', '');

  const file = bucket.file(filePath);

  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));

  file.download({destination: tempFilePath}, function(err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      fs.readFile(tempFilePath, 'utf8', function(err, data) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          res.json({
            title: note.title,
            content: data
          });

          fs.unlink(tempFilePath, function(err) {
            if (err) console.error(err);
          });
        }
      });
    }
  });
};