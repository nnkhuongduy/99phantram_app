import { FC, useMemo } from 'react';
import { Table, Space, Button, Popconfirm } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import {
  ServiceTypeValue,
  ServiceTypeValueType,
} from 'src/models/service-type';

interface Props {
  data: ServiceTypeValue[] | undefined;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const ServiceTypeValueTable: FC<Props> = ({ data, onEdit, onDelete }) => {
  const columns: (
    | ColumnGroupType<ServiceTypeValue>
    | ColumnType<ServiceTypeValue>
  )[] = useMemo(
    () => [
      {
        title: 'Tên thiết lập',
        key: 'key',
        dataIndex: 'key',
      },
      {
        title: 'Kiểu giá trị',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (type: ServiceTypeValueType) => ServiceTypeValueType[type],
      },
      {
        title: 'Chức năng',
        key: 'actions',
        width: 200,
        render: (text, value, index) => (
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={() => onEdit(index)}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Bạn có muốn xóa thiết lập này?"
              okText="Có"
              cancelText="Không"
              icon={
                <span className="anticon">
                  <AiOutlineQuestionCircle style={{ color: 'red' }} />
                </span>
              }
              onConfirm={() => onDelete(index)}
            >
              <Button size="small" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    //eslint-disable-next-line
    [data, onEdit, onDelete]
  );

  return (
    <Table
      bordered
      columns={columns}
      dataSource={data}
      rowKey="key"
    ></Table>
  );
};
