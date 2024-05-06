import { Storage } from '@google-cloud/storage';
import Note from '../models/note.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = new Storage({
    keyFilename: path.join(__dirname, 'keyfile.json'), // Make sure this path is correct
    projectId: 'noteforge'
});

const bucket = storage.bucket('markdown_forge');

export const createNote = async (req, res, next) => {
    console.log('createNote called');
  
    const { title, user } = req.body;
    console.log('title:', title, 'user:', user);
  
    const { path, originalname } = req.file;
    console.log('path:', path, 'originalname:', originalname);
  
    const blob = bucket.file(`${user}/${originalname}`);
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
        fileUrl: publicUrl,
        user,
      });
  
      await newNote.save();
      console.log('newNote saved:', newNote);
  
      res.status(200).send(newNote);
    });
  
    blobStream.end(req.file.buffer);
  };

export const getNotes = async (req, res) => {
  const notes = await Note.find({});
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