import { useState, useEffect } from 'react';
import { Layout, Button, Card, Col, Row, Typography, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { apiCall } from '../utils/apiHandler';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { showCustomToast } from '../components/showCustomToast';

const { Content } = Layout;
const { Title } = Typography;
const { Meta } = Card;

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = showCustomToast();

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

  const handleNewNote = () => {
    navigate('/note/new');
  };

  const handleDelete = async (id) => {
    try {
      const response = await apiCall({
        method: 'DELETE',
        endpoint: `/note/delete/${id}`,
      });

      if (response.status === "success") {
        setNotes(notes.filter(note => note._id !== id)); // Remove the deleted note from the state
        showSuccessToast('Note deleted successfully', 'success'); // Show success message
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      showErrorToast('Failed to delete note', 'error'); // Show error message
    }
  };

  return (
    <div>
      <Navbar />
      <Layout style={{ height: "100vh", overflow: "auto" }}>
        <Content style={{ padding: '50px' }}>
          <Title>Your Notes</Title>
          <div style={{ padding: '24px', minHeight: '280px' }}>
            {notes.length > 0 ? (
              <Row gutter={16}>
                {notes.map(note => (
                  <Col span={8} key={note._id}>
                    <Card
                      hoverable
                      style={{
                        width: '100%',
                        marginBottom: '20px',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                      }}
                      actions={[
                        <DeleteOutlined key="delete" onClick={() => handleDelete(note._id)} />
                      ]}
                    >
                      <Meta title={note.title} />
                      <p>{note.content}</p>
                      <Link
                        to={{
                          pathname: `/note/${note._id}`,
                          state: { fileId: note._id }
                        }} target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Note
                      </Link>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                description="No notes found"
                style={{ margin: '50px 0' }}
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={handleNewNote}>
                  Create your first note
                </Button>
              </Empty>
            )}
          </div>
          {notes.length !== 0 && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginTop: '20px' }}
              onClick={handleNewNote}
            >
              Create a new note
            </Button>
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default HomePage;