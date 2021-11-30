import { FC, useMemo } from 'react';
import { Table, Tag, message, Space, Button, Popconfirm } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import {
  useUpdateServiceTypeMutation,
  useDeleteServiceTypeMutation,
} from 'src/services/service-type';
import { useHttpError } from 'src/hooks/http';
import {
  ServiceType,
  ServiceTypeForm,
  ServiceTypeStatus,
} from 'src/models/service-type';
import { SERVICE_TYPE_CONSTANTS } from 'src/constants/service-type';

interface Props {
  onEdit: (serviceType: ServiceType) => void;
  data: ServiceType[] | undefined;
  isLoading: boolean;
}

export const ServiceTypesTable: FC<Props> = ({
  onEdit,
  data,
  isLoading,
}) => {
  const [updateServiceType, { isLoading: isUpdating }] =
    useUpdateServiceTypeMutation();
  const [deleteServiceType, { isLoading: isDeleting }] =
    useDeleteServiceTypeMutation();

  const httpErrorHandler = useHttpError();

  const onDeactive = async (serviceType: ServiceType) => {
    try {
      const newServiceType: ServiceTypeForm = {
        ...serviceType,
        status: ServiceTypeStatus.DEACTIVE,
      };

      await updateServiceType({ id: serviceType.id, form: newServiceType }).unwrap();

      message.success('Hủy kích hoạt loại dịch vụ thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onReactive = async (serviceType: ServiceType) => {
    try {
      const newServiceType: ServiceTypeForm = {
        ...serviceType,
        status: ServiceTypeStatus.ACTIVE,
      };

      await updateServiceType({ id: serviceType.id, form: newServiceType }).unwrap();

      message.success('Tái kích hoạt loại dịch vụ thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onDelete = async (serviceType: ServiceType) => {
    try {
      await deleteServiceType(serviceType.id).unwrap();

      message.success('Xóa loại dịch vụ thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const columns: (ColumnGroupType<ServiceType> | ColumnType<ServiceType>)[] = useMemo(
    () => [
      {
        title: 'Tên loại dịch vụ',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        align: 'center',
        render: (status) => (
          <Tag color={SERVICE_TYPE_CONSTANTS.STATUS_COLOR[status]}>
            {ServiceTypeStatus[status]}
          </Tag>
        ),
        filters: Object.keys(ServiceTypeStatus)
          .filter((key) => Number.isNaN(Number(key)))
          .map((key) => ({ text: key, value: ServiceTypeStatus[key as any] })),
        onFilter: (value, serviceType) => serviceType.status === value,
      },
      {
        title: 'Chức năng',
        key: 'actions',
        width: 200,
        render: (text, serviceType) => (
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={() => onEdit(serviceType)}
            >
              Sửa
            </Button>
            {serviceType.status === ServiceTypeStatus.ACTIVE ? (
              <Popconfirm
                title="Bạn có muốn hủy kích hoạt loại dịch vụ này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onDeactive(serviceType)}
              >
                <Button size="small" danger loading={isUpdating}>
                  Hủy kích hoạt
                </Button>
              </Popconfirm>
            ) : null}
            {serviceType.status === ServiceTypeStatus.DEACTIVE ? (
              <Popconfirm
                title="Bạn có muốn tái kích hoạt loại dịch vụ này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onReactive(serviceType)}
              >
                <Button size="small" type="primary" loading={isUpdating}>
                  Tái kích hoạt
                </Button>
              </Popconfirm>
            ) : null}
            {serviceType.status === ServiceTypeStatus.DEACTIVE ? (
              <Popconfirm
                title="Bạn có muốn xóa loại dịch vụ này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onDelete(serviceType)}
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
    [data, onEdit, onDeactive]
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
          `${range[0]}-${range[1]} trong ${total} loại dịch vụ`,
      }}
      rowKey="id"
    ></Table>
  );
};
