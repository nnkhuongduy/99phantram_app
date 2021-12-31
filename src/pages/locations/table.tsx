import { FC, useMemo } from 'react';
import { Table, Tag, message, Space, Button, Popconfirm } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import {
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} from 'src/services/location';
import { useHttpError } from 'src/hooks/http';
import {
  Location,
  LocationForm,
  LocationLevel,
  LocationStatus,
} from 'src/models/location';
import { LOCATION_CONSTANTS } from 'src/constants/location';

interface Props {
  onEdit: (location: Location) => void;
  onSubLocations: (location: Location) => void;
  data: Location[] | undefined;
  isLoading: boolean;
}

export const LocationTable: FC<Props> = ({
  onEdit,
  onSubLocations,
  data,
  isLoading,
}) => {
  const [updateLocation, { isLoading: isArchiving }] =
    useUpdateLocationMutation();
  const [deleteLocation, { isLoading: isDeleting }] =
    useDeleteLocationMutation();

  const httpErrorHandler = useHttpError();

  const onArchive = async (location: Location) => {
    try {
      const newLocation: LocationForm = {
        ...location,
        subLocations: location.subLocationsRef,
        status: LocationStatus.ARCHIVED,
      };

      await updateLocation({ id: location.id, form: newLocation }).unwrap();

      message.success('Lưu trữ địa điểm thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onDelete = async (location: Location) => {
    try {
      await deleteLocation(location.id).unwrap();

      message.success('Xóa địa điểm thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const columns: (ColumnGroupType<Location> | ColumnType<Location>)[] = useMemo(
    () => [
      {
        title: 'Tên địa điểm',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'Cấp địa điểm',
        dataIndex: 'locationLevel',
        key: 'locationLevel',
        width: 150,
        align: 'center',
        render: (level) => (
          <Tag color={LOCATION_CONSTANTS.LEVEL_COLOR[level]}>
            {LocationLevel[level]}
          </Tag>
        ),
        filters: Object.keys(LocationLevel)
          .filter((key) => Number.isNaN(Number(key)))
          .map((key) => ({ text: key, value: LocationLevel[key as any] })),
        onFilter: (value, location) => location.locationLevel === value,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        align: 'center',
        render: (status) => (
          <Tag color={LOCATION_CONSTANTS.STATUS_COLOR[status]}>
            {LocationStatus[status]}
          </Tag>
        ),
        filters: Object.keys(LocationStatus)
          .filter((key) => Number.isNaN(Number(key)))
          .map((key) => ({ text: key, value: LocationStatus[key as any] })),
        onFilter: (value, location) => location.status === value,
      },
      {
        title: 'Chức năng',
        key: 'actions',
        width: 200,
        render: (text, location) => (
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={() => onEdit(location)}
            >
              Sửa
            </Button>
            {location.locationLevel !== LocationLevel.BLOCK ? (
              <Button
                size="small"
                type="default"
                onClick={() => onSubLocations(location)}
              >
                Địa điểm con
              </Button>
            ) : null}
            {location.status !== LocationStatus.ARCHIVED ? (
              <Popconfirm
                title="Bạn có muốn lưu trữ danh mục này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onArchive(location)}
              >
                <Button size="small" danger loading={isArchiving}>
                  Lưu trữ
                </Button>
              </Popconfirm>
            ) : null}
            {location.status === LocationStatus.ARCHIVED ? (
              <Popconfirm
                title="Bạn có muốn xóa danh mục này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onDelete(location)}
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
    [data, onEdit, onArchive]
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
