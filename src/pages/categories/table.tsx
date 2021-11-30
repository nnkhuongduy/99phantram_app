import { FC, useMemo } from 'react';
import { Table, Tag, message, Space, Button, Popconfirm } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import {
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from 'src/services/category';
import { useHttpError } from 'src/hooks/http';
import {
  Category,
  CategoryLevel,
  CategoryPutForm,
  CategoryStatus,
} from 'src/models/category';
import { CATEGORY_CONSTANTS } from 'src/constants/category';

interface Props {
  onEdit: (category: Category) => void;
  onSpecs: (category: Category) => void;
  onSubCategories: (category: Category) => void;
  data: Category[] | undefined;
  isLoading: boolean;
}

export const CategoriesTable: FC<Props> = ({
  onEdit,
  onSpecs,
  onSubCategories,
  data,
  isLoading,
}) => {
  const [updateCategory, { isLoading: isArchiving }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const httpErrorHandler = useHttpError();

  const onArchive = async (category: Category) => {
    try {
      const newCategory: CategoryPutForm = {
        ...category,
        specs: category.specs.map((_) => _.id),
      };
      newCategory.status = CategoryStatus.ARCHIVED;

      await updateCategory({ id: category.id, form: newCategory }).unwrap();

      message.success('Lưu trữ danh mục thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onDelete = async (category: Category) => {
    try {
      await deleteCategory(category.id).unwrap();

      message.success('Xóa danh mục thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const columns: (ColumnGroupType<Category> | ColumnType<Category>)[] = useMemo(
    () => [
      {
        title: 'Tên danh mục',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'Cấp danh mục',
        dataIndex: 'categoryLevel',
        key: 'categoryLevel',
        width: 150,
        align: 'center',
        render: (level) => (
          <Tag color={CATEGORY_CONSTANTS.LEVEL_COLOR[level]}>
            {CategoryLevel[level]}
          </Tag>
        ),
        filters: Object.keys(CategoryLevel)
          .filter((key) => Number.isNaN(Number(key)))
          .map((key) => ({ text: key, value: CategoryLevel[key as any] })),
        onFilter: (value, category) => category.categoryLevel === value,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        align: 'center',
        render: (status) => (
          <Tag color={CATEGORY_CONSTANTS.STATUS_COLOR[status]}>
            {CategoryStatus[status]}
          </Tag>
        ),
        filters: Object.keys(CategoryStatus)
          .filter((key) => Number.isNaN(Number(key)))
          .map((key) => ({ text: key, value: CategoryStatus[key as any] })),
        onFilter: (value, category) => category.status === value,
      },
      {
        title: 'Chức năng',
        key: 'actions',
        width: 200,
        render: (text, category) => (
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={() => onEdit(category)}
            >
              Sửa
            </Button>
            {category.categoryLevel === CategoryLevel.SECONDARY ? (
              <Button
                size="small"
                type="default"
                onClick={() => onSpecs(category)}
              >
                Chi tiết
              </Button>
            ) : null}
            {category.categoryLevel === CategoryLevel.PRIMARY ? (
              <Button
                size="small"
                type="default"
                onClick={() => onSubCategories(category)}
              >
                Danh mục con
              </Button>
            ) : null}
            {category.status !== CategoryStatus.ARCHIVED ? (
              <Popconfirm
                title="Bạn có muốn lưu trữ danh mục này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onArchive(category)}
              >
                <Button size="small" danger loading={isArchiving}>
                  Lưu trữ
                </Button>
              </Popconfirm>
            ) : null}
            {category.status === CategoryStatus.ARCHIVED ? (
              <Popconfirm
                title="Bạn có muốn xóa danh mục này?"
                okText="Có"
                cancelText="Không"
                icon={
                  <span className="anticon">
                    <AiOutlineQuestionCircle style={{ color: 'red' }} />
                  </span>
                }
                onConfirm={() => onDelete(category)}
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
          `${range[0]}-${range[1]} trong ${total} danh mục`,
      }}
      rowKey="id"
    ></Table>
  );
};
