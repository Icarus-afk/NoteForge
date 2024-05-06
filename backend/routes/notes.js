import express from 'express';
import multer from 'multer';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/note.js';
import auth from '../middleware/auth.js';


const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/create', upload.single('file'), auth, createNote);
router.get('/get', auth, getNotes);
router.put('/update/:id', upload.single('file'), auth, updateNote);
router.delete('/delete/:id', auth, deleteNote);

export default router;