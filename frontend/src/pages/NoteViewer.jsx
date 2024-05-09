import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownToJSX from 'markdown-to-jsx';
import { apiCall } from '../utils/apiHandler.js';
import { Card, Layout } from 'antd';
import Navbar from '../components/Navbar';
import './dark.css'

const NoteViewer = () => {
  const { fileId } = useParams();
  const [fileContent, setFileContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
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
  }, [fileId]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Card title={title} style={{ width: '80%', margin: 'auto', marginTop: '50px' }}>
        <MarkdownToJSX className="markdown-body">{fileContent}</MarkdownToJSX>
      </Card>
    </Layout>
  );
};

export default NoteViewer;