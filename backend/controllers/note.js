import { Storage } from '@google-cloud/storage';
import Note from '../models/note.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = new Storage({
  keyFilename: path.join(__dirname, 'keyfile.json'),
  projectId: process.env.PROJECT_ID
});

const bucket = storage.bucket('forge_md');

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

  const uniqueFileName = originalname; // Temporarily use the original file name
  // Use the user's ID from req.user as the folder name
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
      .then(() => console.log('Note saved successfully'))
      .catch(err => console.error(err));
    console.log('newNote saved:', newNote);

    res.status(200).send(newNote);
  });

  blobStream.end(req.file.buffer);
};



export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.userId });
  res.status(200).send(notes);
};



export const updateNote = async (req, res, next) => {
  const { title, user } = req.body;
  const { path, originalname } = req.file;

  const blob = bucket.file(`${user}/${originalname}`);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    next(err);
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {
      title,
      fileUrl: publicUrl,
      user,
    }, { new: true });

    res.status(200).send(updated);
  });

  blobStream.end(req.file.buffer);
};



export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  const fileName = note.fileUrl.split('/').pop();

  const file = bucket.file(fileName);

  await file.delete();
  await note.remove();

  res.status(200).send({ message: 'Note deleted successfully' });
};