import mongoose from "mongoose";

const noteSchema = mongoose.Schema({
  title: { type: String, required: true },
  FileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;