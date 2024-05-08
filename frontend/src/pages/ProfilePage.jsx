import { Layout, Card, Typography, Avatar, Descriptions } from 'antd';
import Navbar from '../components/Navbar';
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('user')); // Get user data from local storage

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
                <Card style={{ width: 500 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <Avatar size={64} src={`data:image/jpeg;base64,${user.userImage}`} />
                    </div>
                    <Title level={2} style={{ textAlign: 'center' }}>{user.name}</Title>
                    <Descriptions column={1}>
                        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">{new Date(user.dateOfBirth).toLocaleDateString()}</Descriptions.Item>
                        <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number">{user.phoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="Bio">{user.bio}</Descriptions.Item>
                        <Descriptions.Item label="Interests">{user.interests.join(', ')}</Descriptions.Item>
                        <Descriptions.Item label="Joined At">{new Date(user.joinedAt).toLocaleDateString()}</Descriptions.Item>
                        <Descriptions.Item label="Active">
                            {user.isActive ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Content>
        </Layout>
    );
};

export default ProfilePage;