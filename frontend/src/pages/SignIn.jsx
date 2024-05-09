import { useState } from 'react';
import { Layout, Row, Col, Form, Input, Button, Card, } from 'antd';
import { Link } from 'react-router-dom';
import { showCustomToast } from '../components/showCustomToast.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from '../utils/apiHandler.js';
import logo from '../assets/logo.png'; // Import the logo



const SignIn = () => {
    const { showSuccessToast, showErrorToast } = showCustomToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await apiCall({
                method: 'POST',
                endpoint: '/user/signin',
                data: { email, password },
            });

            if (response.success) {
                showSuccessToast(response.message);
                localStorage.setItem('user', JSON.stringify(response.data.result)); // Save user data to local storage
                navigate(from.pathname)
            } else {
                showErrorToast(response.message);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorToast(error.response && error.response.data.message ? error.response.data.message : "An error occurred...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={logo} alt="Logo" style={{ display: 'block', margin: '0 auto', padding: '20px'}} /> {/* Add the logo */}

            <Row>
                <Col span={24}>
                    <Card title="Sign In" headStyle={{ textAlign: 'center' }}>
                        <Form onFinish={handleSubmit}>
                            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                                <Input.Password placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>Sign In</Button>
                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
                                </div>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default SignIn;