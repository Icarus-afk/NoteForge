import { useState } from 'react';
import { Layout, Row, Col, Form, Input, Button, Card, DatePicker, Space, Typography, Divider } from 'antd'; //Checkbox, Upload, 
import { apiCall } from '../utils/apiHandler';
// import { UploadOutlined } from '@ant-design/icons';

import { showCustomToast } from '../components/showCustomToast';

const { Title } = Typography;


const SignUp = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userImage, setUserImage] = useState();
    // const [confirmPassword, setConfirmPassword] = useState('');
    // const [userDetails, setUserDetails] = useState({});

    const handleFirstStepSubmit = async (values) => {
        const { showErrorToast } = showCustomToast();

        if (values.password !== values.confirmPassword) {
            showErrorToast('Passwords do not match');
            return;
        }

        setEmail(values.email);
        setPassword(values.password);
        setStep(2);
    };

    const handleSecondStepSubmit = async (values) => {
        const { showSuccessToast, showErrorToast } = showCustomToast();
        const userData = new FormData();
        userData.append('email', email);
        userData.append('password', password);
        Object.keys(values).forEach(key => {
            if (key !== 'userImage') {
                userData.append(key, values[key]);
            }
        });
        if (userImage) {
            userData.append('userImage', userImage);
        }

        try {
            const response = await apiCall({
                method: 'POST',
                endpoint: '/user/signup',
                data: userData,
            });

            if (response.success) {
                showSuccessToast('Signed up successfully');
            } else {
                showErrorToast(response.message);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorToast(error.response && error.response.data.message ? error.response.data.message : 'An error occurred...');
        }
    };

    // const handleUpload = file => {
    //     setUserImage(file.originFileObj);
    //     return false;
    // };

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
            <Row>
                <Col span={24} offset={0}>
                    <Card bordered={false} style={{ width: '100%', maxWidth: '100vw', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' }}>
                        <Title level={2} style={{ textAlign: 'center' }}>Sign Up</Title>
                        <Divider />
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {step === 1 ? (
                                <Form onFinish={handleFirstStepSubmit}>
                                    <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                                        <Input placeholder="Email" />
                                    </Form.Item>
                                    <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                                        <Input.Password placeholder="Password" />
                                    </Form.Item>
                                    <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password!' }]}>
                                        <Input.Password placeholder="Confirm Password" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>Next</Button>
                                    </Form.Item>
                                </Form>
                            ) : (
                                <Form onFinish={handleSecondStepSubmit}>
                                    <Form.Item name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
                                        <Input placeholder="First Name" />
                                    </Form.Item>
                                    <Form.Item name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
                                        <Input placeholder="Last Name" />
                                    </Form.Item>
                                    <Form.Item name="dateOfBirth" rules={[{ required: true, message: 'Please input your date of birth!' }]}>
                                        <DatePicker placeholder="Date of Birth" />
                                    </Form.Item>
                                    <Form.Item name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
                                        <Input placeholder="Address" />
                                    </Form.Item>
                                    <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Please input your phone number!' }]}>
                                        <Input placeholder="Phone Number" />
                                    </Form.Item>
                                    <Form.Item name="bio">
                                        <Input.TextArea placeholder="Bio" />
                                    </Form.Item>
                                    <Form.Item name="interests">
                                        <Input placeholder="Interests" />
                                    </Form.Item>
                                    {/* <Form.Item label="Profile Photo">
                                        <Upload beforeUpload={handleUpload}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item> */}
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>Sign Up</Button>
                                    </Form.Item>

                                </Form>
                            )}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default SignUp;