import { Layout, Card, Typography, Avatar } from 'antd';
import Navbar from '../components/Navbar';
import { UserOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('user')); // Get user data from local storage

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Content style={{ padding: '0 50px', marginTop: 128 }}>
                <div style={{ adding: 24, minHeight: 380, display: 'flex', justifyContent: 'center' }}>
                    <Card style={{ width: 300 }}>
                        <Avatar size={64} icon={<UserOutlined />} />
                        <Title level={2} style={{ textAlign: 'center' }}>{user.name}</Title>
                        <Paragraph>Email: {user.email}</Paragraph>
                        <Paragraph>Joined at: {new Date(user.joinedAt).toLocaleDateString()}</Paragraph>
                        <Paragraph>Active: {user.isActive ? 'Yes' : 'No'}</Paragraph>
                        <Paragraph>Admin: {user.isAdmin ? 'Yes' : 'No'}</Paragraph>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
};

export default ProfilePage;