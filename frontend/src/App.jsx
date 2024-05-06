import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    axios.get('http://localhost:8000/notes')
      .then(response => setNotes(response.data));
  }, []);

  const createNote = () => {
    axios.post('http://localhost:8000/notes', newNote)
      .then(response => setNotes(prevNotes => [...prevNotes, response.data]));
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '10px' }}>
        <h1>New Note</h1>
        <input
          value={newNote.title}
          onChange={e => setNewNote(prevNote => ({ ...prevNote, title: e.target.value }))}
          placeholder="Title"
        />
        <textarea
          value={newNote.content}
          onChange={e => setNewNote(prevNote => ({ ...prevNote, content: e.target.value }))}
          placeholder="Content"
        />
        <button onClick={createNote}>Create Note</button>
        <h1>Notes</h1>
        {notes.map(note => (
          <div key={note.id}>
            <h2>{note.title}</h2>
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '10px', overflow: 'auto', borderLeft: '1px solid black' }}>
        <h1>Preview</h1>
        <ReactMarkdown>{newNote.content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default App;