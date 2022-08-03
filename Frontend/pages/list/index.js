import { Table, Pagination } from 'antd';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';

const List = () => {
    const columns = [{
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
    }, {
        title: 'Password',
        dataIndex: 'password',
        key: 'password',
    }];
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    },[])
    const token = localStorage.getItem('TOKEN')
    
    const getData = (page=1) => {
        if(!token) {
            navigate('/login')
            return
        }
        const size = 5;
        axios.get(`http://localhost:3001/api/user?page=${page}&size=${size}`, {
            headers: {
                authorization: token
            }
        }).then(res => {
            console.log(res)
            const data = res.data.data;
            data.forEach((item, index) => {
                item.key = index
            })
            setTotal(res.data.total);
            setData(data);
        })
    }
    const handlePage = (page) => {
        console.log('page ', page)
        setPage(page);
        getData(page)
    }
    return (
        <div>
            <Table columns={columns} dataSource={data} pagination={false}/>
            <Pagination total={total} current={page} pageSize={5} onChange={handlePage}/>
        </div>
    )
}

export default List;