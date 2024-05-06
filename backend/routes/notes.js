import express from 'express';
import multer from 'multer';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/note.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Create a new note
router.post('/create', upload.single('file'), createNote);

// Get all notes
router.get('/notes', getNotes);

// Update a note by id
router.put('/notes/:id', upload.single('file'), updateNote);

// Delete a note by id
router.delete('/notes/:id', deleteNote);

export default router;