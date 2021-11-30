import { FC, useMemo } from 'react';
import { Table, Space, Button, Popconfirm } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import { ServiceValue } from 'src/models/service';

interface Props {
  data: ServiceValue[] | undefined;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const ServiceValueTable: FC<Props> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const columns: (
    | ColumnGroupType<ServiceValue>
    | ColumnType<ServiceValue>
  )[] = useMemo(
    () => [
      {
        title: 'Tên thiết lập',
        key: 'key',
        dataIndex: 'key',
      },
      {
        title: 'Giá trị',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: 'Chức năng',
        key: 'actions',
        width: 200,
        render: (text, value, index) => (
          <Space>
            <Button size="small" type="primary" onClick={() => onEdit(index)}>
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
    <Table bordered columns={columns} dataSource={data} rowKey="key"></Table>
  );
};
