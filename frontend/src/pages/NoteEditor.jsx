import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownToJSX from 'markdown-to-jsx';
import 'react-markdown-editor-lite/lib/index.css';

const serverUrl = 'http://localhost:8000';

const NoteEditor = () => {
  const { fileId } = useParams();

  console.log("Field ID -->", fileId)
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`${serverUrl}/note/get/file/${fileId}`);
        console.log(response)   
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = function () {
          const markdownText = reader.result;
          setFileContent(markdownText);
        };
        reader.readAsText(blob);
      } catch (error) {
        console.error('An error occurred while fetching the note:', error);
      }
    };

    fetchNote();
  }, [fileId]);

  return (
    <MdEditor
      value={fileContent}
      style={{ height: "500px" }}
      renderHTML={(text) => <MarkdownToJSX>{text}</MarkdownToJSX>}
      readOnly
    />
  );
};

export default NoteEditor;