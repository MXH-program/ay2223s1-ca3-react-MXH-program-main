import { Layout, Dropdown, Menu, Space  } from 'antd';
import './index.css'
import List from '../list/index';
import {useLocation, useNavigate} from 'react-router-dom';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Header, Content } = Layout;
const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location)
    const username = location?.state?.username || ''

    const handleLogout = () => {
        axios.get('http://localhost:3001/api/login').then(res => {
            console.log("res ", res)
            if(res.data.status === 'ok') {
                localStorage.removeItem('TOKEN');
                navigate('/login')
            }

        })
    }

    const menu = (
        <Menu
          items={[
            {
              key: '1',
              label: (
                <a onClick={handleLogout}>
                 Logout
                </a>
              ),
            },
          ]}
        />
      );
    return (
        <Layout className="home" id="home">
            <Header style={{textAlign: 'right'}}>
                <Dropdown overlay={menu}>
                    <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        Hello!{username}
                        <DownOutlined />
                    </Space>
                    </a>
                </Dropdown>
            </Header>
            <Content>
                <List></List>
            </Content>
        </Layout>
    )
}
export default Home;