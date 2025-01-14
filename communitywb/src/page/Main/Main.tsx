import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Layout, Space } from 'antd'; // Import Modal from Ant Design
import { useNavigate } from 'react-router-dom';
import '../../App.css'; // Import the external CSS file
import { clearTokensAndUser } from '../../utils/tokenUtils';
import MainBoard from './MainBoard';

const { Header, Content } = Layout;

function MainPage() {
    const navigate = useNavigate();


    const handleLogout = () => {
        clearTokensAndUser();
        navigate('/loginSignUp');
    };

    const dropDownItems = [
        {
            key: 'logout',
            label: 'Log out',
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <Layout className="app-layout">
            <Header className="app-header">
                <h1 className="app-title">Look Around</h1>
                <Space>
                    <Button type="text" icon={<UserOutlined />} />
                    <Dropdown menu={{ items: dropDownItems }}>
                        <Button type="text" icon={<MenuOutlined />} />
                    </Dropdown>

                </Space>
            </Header>

            <Content className="app-content">
                <MainBoard />
            </Content>

        </Layout>
    );
}

export default MainPage;