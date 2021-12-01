import { FC, useEffect, useState } from 'react';
import { Row, Col, Input, Select, Button, Drawer } from 'antd';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  useHistory,
  Route,
  Switch,
  useLocation,
  useParams,
} from 'react-router-dom';

import { useHeaderTitle } from 'src/hooks/header-title';
import { UsersTable } from './table';
import { AddUser } from './add/add';
import { EditUser } from './edit/edit';
import { User } from 'src/models/user';
import { useGetUsersQuery } from 'src/services/user';

const { Group, Search } = Input;

export const UsersPage: FC = () => {
  useHeaderTitle('Danh sách người dùng');

  const history = useHistory();
  const location = useLocation();
  const {id: userId} = useParams<{ id: string }>();
  
  const [visible, setVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>();
  const [query, setQuery] = useState<{
    queryType: 'email' | 'phoneNumber' | 'name';
    query: string;
  }>({
    queryType: 'name',
    query: '',
  });
  const [_users, _setUsers] = useState<User[]>([]);

  const { data: users, isFetching } = useGetUsersQuery();

  useEffect(() => {
    if (location.pathname === '/users') {
      setVisible(false);
    } else if (userId && userId.length === 24) {
      setVisible(true);
      setDrawerTitle('Sửa thông tin người dùng');
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    filter();
    //eslint-disable-next-line
  }, [users]);

  const filter = () => {
    if (users) {
      const { query: value, queryType } = query;
      _setUsers(
        queryType === 'name'
          ? users.filter((user) =>
              `${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(value.toLowerCase())
            )
          : users.filter((user) => user[queryType]!.includes(value))
      );
    }
  };

  const onAdd = () => {
    history.push('/users/add');
    setVisible(true);
    setDrawerTitle('Thêm người dùng');
  };

  const onEdit = (user: User) => {
    history.push('/users/' + user.id);
    setVisible(true);
    setDrawerTitle('Sửa thông tin người dùng');
  };

  const onClose = () => {
    history.push('/users');
  };

  return (
    <>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={12}>
              <Group compact>
                <Search
                  addonBefore={
                    <Select
                      value={query.queryType}
                      onChange={(value) =>
                        setQuery({ ...query, queryType: value })
                      }
                    >
                      <Select.Option value="name">Tên</Select.Option>
                      <Select.Option value="email">Email</Select.Option>
                      <Select.Option value="phoneNumber">SĐT</Select.Option>
                    </Select>
                  }
                  placeholder="Tìm kiếm..."
                  enterButton
                  value={query.query}
                  onChange={(value) =>
                    setQuery({ ...query, query: value.target.value })
                  }
                  onSearch={filter}
                ></Search>
              </Group>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<AiOutlinePlus className="app-icon" />}
                onClick={onAdd}
              >
                Thêm
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <UsersTable onEdit={onEdit} data={_users} isLoading={isFetching} />
        </Col>
        <Col span={24}></Col>
      </Row>
      <Drawer
        title={drawerTitle}
        placement="right"
        visible={visible}
        onClose={onClose}
        width={800}
        destroyOnClose
        maskClosable={false}
      >
        <Switch>
          <Route path="/users/add" exact component={AddUser} />
          <Route path="/users/:id" component={EditUser} />
        </Switch>
      </Drawer>
    </>
  );
};
