import { Layout, Menu, Space, Switch } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import deleteCookies from '../utils/DeleteCookies'; // Replace with the actual path to deleteTokens

const { Header } = Layout;

const Navbar = ({ onToggle, isDarkMode }) => {
    const location = useLocation();
    const handleLogout = () => {
        deleteCookies(); // Delete the tokens
        window.location.href = '/signin'; // Redirect to the sign-in page
    };

    const getSelectedKey = () => {
        switch (location.pathname) {
            case '/':
                return '1';
            case '/profile':
                return '2';
            default:
                return '1';
        }
    };

    return (
        <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[getSelectedKey()]}>
                <Menu.Item key="1">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/profile">Profile</Link>
                </Menu.Item>
            </Menu>
            <Space>
                <Menu theme="dark" mode="horizontal" onClick={handleLogout}>
                    <Menu.Item key="3">
                        Logout
                    </Menu.Item>
                </Menu>
            </Space>
        </Header>
    );
};

export default Navbar;