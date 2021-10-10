import { FC } from 'react';
import { Button, Space, Table, Tooltip, Tag } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';

import { useGetUsersQuery } from 'src/services/user';
import { User, UserStatus } from 'src/models/user';
import { Avatar } from 'src/components/avatar/avatar';
import { USER_CONSTANTS } from 'src/constants/user';

const columns: (ColumnGroupType<User> | ColumnType<User>)[] = [
  {
    key: 'avatar',
    dataIndex: 'avatar',
    render: (avatar, user) => <Avatar size={30} user={user} />,
    width: 60,
  },
  {
    title: 'Họ tên',
    dataIndex: 'firstName',
    key: 'firstName',
    colSpan: 2,
  },
  {
    dataIndex: 'lastName',
    key: 'lastName',
    colSpan: 0,
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    ellipsis: {
      showTitle: false,
    },
    render: (email) => (
      <Tooltip placement="topLeft" title={email}>
        {email}
      </Tooltip>
    ),
  },
  {
    title: 'SĐT',
    key: 'phoneNumber',
    dataIndex: 'phoneNumber',
  },
  {
    title: 'Vai trò',
    key: 'role',
    dataIndex: 'role',
    render: (role) => <Tag>{role.name}</Tag>,
    width: 100,
    align: 'center',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={USER_CONSTANTS.STATUS_COLOR[status]}>
        {UserStatus[status]}
      </Tag>
    ),
    width: 100,
    align: 'center',
  },
  {
    title: 'Chức năng',
    key: 'actions',
    render: () => (
      <Space>
        <Button size="small" type="primary">
          Chi tiết
        </Button>
        <Button size="small" danger>
          Lưu trữ
        </Button>
      </Space>
    ),
  },
];

export const UsersTable: FC = () => {
  const { data, isFetching } = useGetUsersQuery({});

  return (
    <Table
      bordered
      columns={columns}
      loading={isFetching}
      dataSource={data}
      pagination={{
        position: ['bottomRight'],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong ${total} người dùng`,
      }}
    ></Table>
  );
};
