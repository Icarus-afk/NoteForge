import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showCustomToast } from '../components/showCustomToast.jsx';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownToJSX from 'markdown-to-jsx';
import 'react-markdown-editor-lite/lib/index.css';
import { apiCall } from '../utils/apiHandler.js';
import { Input, Button, Card, Layout } from 'antd';
import Navbar from '../components/Navbar';



const NoteEditor = ({ isNewNote }) => {
  const { fileId } = useParams();
  const [fileContent, setFileContent] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = showCustomToast();

  useEffect(() => {
    if (!isNewNote) {
      const fetchNote = async () => {
        try {
          const note = await apiCall({
            method: 'GET',
            endpoint: `/note/get/file/${fileId}`,
          });
          setFileContent(note.content);
          setTitle(note.title);
        } catch (error) {
          console.error('An error occurred while fetching the note:', error);
        }
      };

      fetchNote();
    }
  }, [fileId, isNewNote]);

  const handleUpdate = async () => {
    if (title.trim() === '') {
      showErrorToast('Please insert a title.');
      return;
    }

    const formData = new FormData();
    const file = new File([fileContent], `${title}.md`, { type: 'text/markdown' });
    formData.append('file', file);
    formData.append('title', title);

    try {
      if (isNewNote) {
        const response = await apiCall({
          method: 'POST',
          endpoint: `/note/create`,
          data: formData,
        });
        navigate(`/note/${response.data._id}`);
      } else {
        await apiCall({
          method: 'PUT',
          endpoint: `/note/update/${fileId}`,
          data: formData,
        });
      }
      showSuccessToast('Note has been updated.');
    } catch (error) {
      console.error('An error occurred while updating the note:', error);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Navbar />
      <Card title="Note Editor" style={{ width: '80%', margin: 'auto', marginTop: '50px' }}>
        <Input
          placeholder="Enter title"
          value={title}
          onChange={handleTitleChange}
          style={{ marginBottom: '20px' }}
        />
        <MdEditor
          value={fileContent}
          style={{ height: "500px", marginBottom: '20px' }}
          renderHTML={(text) => <MarkdownToJSX>{text}</MarkdownToJSX>}
          onChange={({ text }) => setFileContent(text)}
        />
        <Button type="primary" onClick={handleUpdate}>{isNewNote ? 'Create' : 'Update'}</Button>
      </Card>
    </Layout>
  );
};

export default NoteEditor;