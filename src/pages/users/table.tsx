import { FC, useMemo } from 'react';
import { Button, Space, Table, Tooltip, Tag, Popconfirm, message } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import dayjs from 'dayjs';

import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from 'src/services/user';
import { Gender, User, UserForm, UserStatus } from 'src/models/user';
import { Avatar } from 'src/components/avatar/avatar';
import { USER_CONSTANTS } from 'src/constants/user';
import { useHttpError } from 'src/hooks/http';
import { useGetSelectableRolesQuery } from 'src/services/role';

interface Props {
  onEdit: (user: User) => void;
  data: User[] | undefined;
  isLoading: boolean;
}

export const UsersTable: FC<Props> = ({ onEdit, data, isLoading }) => {
  const { data: roles } = useGetSelectableRolesQuery();
  const [updateUser, { isLoading: isArchiving }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const httpErrorHandler = useHttpError();

  const onArchive = async (user: User) => {
    try {
      const newUser: UserForm = { ...user, role: user.role.id };
      newUser.status = UserStatus.ARCHIVED;

      await updateUser({ id: user.id, form: newUser }).unwrap();

      message.success('Lưu trữ người dùng thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onDelete = async (user: User) => {
    try {
      await deleteUser(user.id).unwrap();

      message.success('Xóa người dùng thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const columns: (ColumnGroupType<User> | ColumnType<User>)[] = useMemo(
    () => [
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
        title: 'Giới tính',
        key: 'sex',
        dataIndex: 'sex',
        render: (sex: number) => Gender[sex],
        filters: Object.keys(Gender)
          .filter((key) => Number.isNaN(Number(key)))
          .map((key) => ({ text: key, value: Gender[key as any] })),
        onFilter: (value, user) => user.sex === value,
        width: 120,
      },
      {
        title: 'Ngày tạo',
        key: 'createdOn',
        dataIndex: 'createdOn',
        ellipsis: {
          showTitle: false,
        },
        render: (date) => (
          <Tooltip placement="top" title={dayjs(date).format('L LTS')}>
            {dayjs(date).format('L LTS')}
          </Tooltip>
        ),
        sorter: (a, b) => dayjs(a.createdOn).unix() - dayjs(b.createdOn).unix(),
        defaultSortOrder: 'descend',
      },
      {
        title: 'Vai trò',
        key: 'role',
        dataIndex: 'role',
        render: (role) => <Tag>{role.name}</Tag>,
        width: 120,
        align: 'center',
        filters: roles
          ? roles.map((role) => ({
              text: role.name,
              value: role.id,
            }))
          : [],
        onFilter: (value, user) => user.role.id === value,
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
        width: 120,
        align: 'center',
        filters: Object.keys(UserStatus)
          .filter((key) => Number.isNaN(Number(key)))
          .map((key) => ({ text: key, value: UserStatus[key as any] })),
        onFilter: (value, user) => user.status === value,
      },
      {
        title: 'Chức năng',
        key: 'actions',
        render: (text, user) => (
          <Space>
            <Button size="small" type="primary" onClick={() => onEdit(user)}>
              Sửa
            </Button>
            {user.status !== 2 ? (
              <Popconfirm
                title="Bạn có muốn lưu trữ người dùng này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onArchive(user)}
              >
                <Button size="small" danger loading={isArchiving}>
                  Lưu trữ
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Bạn có muốn xóa người dùng này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onDelete(user)}
              >
                <Button size="small" danger loading={isDeleting}>
                  Xóa
                </Button>
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ],
    //eslint-disable-next-line
    [data, roles, onEdit, onArchive]
  );

  return (
    <Table
      bordered
      columns={columns}
      loading={isLoading}
      dataSource={data}
      pagination={{
        position: ['bottomRight'],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong ${total} người dùng`,
      }}
      rowKey="id"
    ></Table>
  );
};
