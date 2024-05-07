import React, { useState, useEffect } from 'react';
import { Layout, Button, List, Typography, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { apiCall } from '../utils/apiHandler';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const { Content } = Layout;
const { Title } = Typography;
// const navigate = useNavigate();


const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNoteContent, setSelectedNoteContent] = useState('');


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await apiCall({
          method: 'GET',
          endpoint: '/note/get',
        });

        if (response.status === "success") {
          setNotes(response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchNotes();
  }, []);


  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <Title>Your Notes</Title>
        {notes.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={notes}
            renderItem={note => (
              <List.Item>
                <List.Item.Meta
                  title={note.title}
                  description={
                    <Link
                      to={{
                        pathname: `/note/${note._id}`,
                        state: { fileId: note._id }
                      }} target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Note
                    </Link>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description="No notes found"
            style={{ margin: '50px 0' }}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              Create your first note
            </Button>
          </Empty>
        )}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginTop: '20px' }}
        >
          Create a new note
        </Button>
      </Content>
    </Layout>
  );
};

export default HomePage;