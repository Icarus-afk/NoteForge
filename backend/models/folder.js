import mongoose from "mongoose";

const folderSchema = mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  });
  
  const Folder = mongoose.model("Folder", folderSchema);
  
  export default Folder;