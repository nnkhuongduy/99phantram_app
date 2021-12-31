import { FC, useMemo } from 'react';
import { Table, Tag, message, Space, Button, Popconfirm, Tooltip } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import dayjs from 'dayjs';

import {
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from 'src/services/service';
import { useHttpError } from 'src/hooks/http';
import {
  Service,
  ServiceForm,
  ServiceStatus,
} from 'src/models/service';
import { SERVICE_TYPE_CONSTANTS } from 'src/constants/service-type';

interface Props {
  onEdit: (service: Service) => void;
  data: Service[] | undefined;
  isLoading: boolean;
}

export const ServicesTable: FC<Props> = ({
  onEdit,
  data,
  isLoading,
}) => {
  const [updateService, { isLoading: isDeactiving }] =
  useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] =
  useDeleteServiceMutation();

  const httpErrorHandler = useHttpError();

  const onTerminate = async (service: Service) => {
    try {
      const newService: ServiceForm = {
        name: service.name,
        serviceType: service.serviceType.id,
        value: service.value,
        status: ServiceStatus.EXPIRED,
      };

      await updateService({ id: service.id, form: newService }).unwrap();

      message.success('Hủy kích hoạt dịch vụ thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onReactive = async (service: Service) => {
    try {
      const newService: ServiceForm = {
        name: service.name,
        serviceType: service.serviceType.id,
        value: service.value,
        status: ServiceStatus.ACTIVE,
      };

      await updateService({ id: service.id, form: newService }).unwrap();

      message.success('Tái kích hoạt dịch vụ thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onDelete = async (service: Service) => {
    try {
      await deleteService(service.id).unwrap();

      message.success('Xóa dịch vụ thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const columns: (ColumnGroupType<Service> | ColumnType<Service>)[] = useMemo(
    () => [
      {
        title: 'Tên dịch vụ',
        key: 'name',
        dataIndex: 'name',
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
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        align: 'center',
        render: (status) => (
          <Tag color={SERVICE_TYPE_CONSTANTS.STATUS_COLOR[status]}>
            {ServiceStatus[status]}
          </Tag>
        ),
        filters: Object.keys(ServiceStatus)
          .filter((key) => Number.isNaN(Number(key)))
          .map((key) => ({ text: key, value: ServiceStatus[key as any] })),
        onFilter: (value, service) => service.status === value,
      },
      {
        title: 'Chức năng',
        key: 'actions',
        width: 250,
        render: (text, service) => (
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={() => onEdit(service)}
            >
              Sửa
            </Button>
            {service.status === ServiceStatus.ACTIVE ? (
              <Popconfirm
                title="Bạn có muốn hủy kích hoạt dịch vụ này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onTerminate(service)}
              >
                <Button size="small" danger loading={isDeactiving}>
                  Hủy kích hoạt
                </Button>
              </Popconfirm>
            ) : null}
            {service.status === ServiceStatus.EXPIRED ? (
              <Popconfirm
                title="Bạn có muốn tái kích hoạt dịch vụ này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onReactive(service)}
              >
                <Button size="small" type="primary" loading={isDeactiving}>
                  Tái kích hoạt
                </Button>
              </Popconfirm>
            ) : null}
            {service.status === ServiceStatus.EXPIRED ? (
              <Popconfirm
                title="Bạn có muốn xóa dịch vụ này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onDelete(service)}
              >
                <Button size="small" danger loading={isDeleting}>
                  Xóa
                </Button>
              </Popconfirm>
            ) : null}
          </Space>
        ),
      },
    ],
    //eslint-disable-next-line
    [data, onEdit, onTerminate]
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
          `${range[0]}-${range[1]} trong ${total} dịch vụ`,
      }}
      rowKey="id"
    ></Table>
  );
};
