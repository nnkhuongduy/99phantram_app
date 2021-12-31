import { FC, useMemo } from 'react';
import { Table, Tag, Space, Button, Typography, Tooltip } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import dayjs from 'dayjs';

import { Supply, SupplyStatus } from 'src/models/supply';
import { SUPPLY_CONSTANTS } from 'src/constants/supply';
import { User } from 'src/models/user';
import { Category } from 'src/models/category';
import { Avatar } from 'src/components/avatar/avatar';

interface Props {
  onInfo: (supply: Supply) => void;
  data: Supply[] | undefined;
  isLoading: boolean;
}

export const SupplyTable: FC<Props> = ({ onInfo, data, isLoading }) => {
  const columns: (ColumnGroupType<Supply> | ColumnType<Supply>)[] = useMemo(
    () => [
      {
        title: 'Người đăng',
        key: 'owner',
        dataIndex: 'owner',
        width: 150,
        render: (owner: User) => (
          <>
            <Avatar size={30} user={owner} />
            <Typography.Text style={{ marginLeft: '5px' }}>
              {owner.lastName} {owner.firstName}
            </Typography.Text>
          </>
        ),
      },
      {
        title: 'Tên sản phẩm',
        key: 'name',
        dataIndex: 'name',
        ellipsis: {
          showTitle: false,
        },
        render: (name) => (
          <Tooltip placement="topLeft" title={name}>
            {name}
          </Tooltip>
        ),
      },
      {
        title: 'Danh mục',
        dataIndex: 'categories',
        key: 'categories',
        width: 150,
        render: (categories: Category[]) => (
          <span>
            {categories[0].name}, {categories[1].name}
          </span>
        ),
      },
      {
        title: 'Ngày đăng',
        dataIndex: 'createdOn',
        key: 'createdOn',
        ellipsis: {
          showTitle: false,
        },
        render: (date) => {
          const text = dayjs(date).format('L LTS');
          return (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          );
        },
        sorter: (a, b) => dayjs(a.createdOn).unix() - dayjs(b.createdOn).unix(),
        defaultSortOrder: 'descend',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        align: 'center',
        render: (status) => (
          <Tag color={SUPPLY_CONSTANTS.STATUS_COLOR[status]}>
            {SupplyStatus[status]}
          </Tag>
        ),
        filters: Object.keys(SupplyStatus)
          .filter((key) => Number.isNaN(Number(key)))
          .map((key) => ({ text: key, value: SupplyStatus[key as any] })),
        onFilter: (value, location) => location.status === value,
      },
      {
        title: 'Chức năng',
        key: 'actions',
        width: 200,
        render: (text, supply) => (
          <Space>
            <Button size="small" type="primary" onClick={() => onInfo(supply)}>
              Chi tiết
            </Button>
          </Space>
        ),
      },
    ],
    //eslint-disable-next-line
    [data, onInfo]
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
          `${range[0]}-${range[1]} trong ${total} địa điểm`,
      }}
      rowKey="id"
    ></Table>
  );
};
