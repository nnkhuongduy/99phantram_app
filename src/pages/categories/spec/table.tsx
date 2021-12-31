import { useMemo, useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
  Table,
  Drawer,
  Space,
  Popconfirm,
  message,
} from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import styled from 'styled-components';
import {
  useLocation,
  useParams,
  useHistory,
  Switch,
  Route,
} from 'react-router-dom';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import { Spec } from 'src/models/spec';
import { CategoryAddSpec } from './add-spec';
import { useGetCategoryQuery } from 'src/services/category';
import { CategoryEditSpec } from './edit-spec';
import { useDeleteSpecMutation } from 'src/services/spec';
import { useHttpError } from 'src/hooks/http';

const RowStyled = styled(Row)`
  margin: 16px 0;
`;

export const CategorySpecsTable = () => {
  const location = useLocation();
  const history = useHistory();
  const { id: categoryId } = useParams<{ id: string }>();
  const httpErrorHandler = useHttpError();

  const { data: category, isFetching } = useGetCategoryQuery(categoryId);
  const [deleteSpec, { isLoading: isDeleting }] = useDeleteSpecMutation();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');

  const columns: (ColumnGroupType<Spec> | ColumnType<Spec>)[] = useMemo(
    () => [
      {
        title: 'Nhãn',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'Bắt buộc',
        key: 'required',
        dataIndex: 'required',
        render: (required) => (required ? 'Có' : 'Không'),
        width: 150,
      },
      {
        title: 'Chức năng',
        key: 'actions',
        width: 150,
        render: (text, spec) => (
          <Space>
            <Button size="small" type="primary" onClick={() => onEdit(spec)}>
              Sửa
            </Button>
            <Popconfirm
              title="Bạn có muốn xóa chi tiết danh mục này?"
              okText="Có"
              cancelText="Không"
              icon={
                <span className="anticon">
                  <AiOutlineQuestionCircle style={{ color: 'red' }} />
                </span>
              }
              onConfirm={() => onDelete(spec)}
            >
              <Button size="small" danger loading={isDeleting}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    //eslint-disable-next-line
    []
  );

  useEffect(() => {
    if (location.pathname === '/categories/' + categoryId + '/specs') {
      setDrawerVisible(false);
    }
    //eslint-disable-next-line
  }, [location]);

  const onAdd = () => {
    history.push(`/categories/${categoryId}/specs/add`);
    setDrawerVisible(true);
    setDrawerTitle('Thêm chi tiết danh mục');
  };

  const onEdit = (spec: Spec) => {
    history.push(`/categories/${categoryId}/specs/${spec.id}`);
    setDrawerVisible(true);
    setDrawerTitle('Sửa chi tiết danh mục');
  };

  const onDelete = async (spec: Spec) => {
    try {
      await deleteSpec({ categoryId, specId: spec.id }).unwrap();

      message.success('Chi tiết danh mục đã được xóa thành công!');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onClose = () => {
    history.push('/categories/' + categoryId + '/specs');
  };

  return (
    <>
      <RowStyled gutter={[8, 8]}>
        <Col span={24}>
          <Button type="primary" size="small" onClick={onAdd}>
            Thêm chi tiết
          </Button>
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            loading={isFetching}
            dataSource={category?.specs}
            rowKey="id"
          ></Table>
        </Col>
      </RowStyled>
      <Drawer
        visible={drawerVisible}
        onClose={onClose}
        width={800}
        destroyOnClose
        maskClosable={false}
        title={drawerTitle}
      >
        <Switch>
          <Route
            path={`/categories/:id/specs/add`}
            exact
            component={CategoryAddSpec}
          />
          <Route
            path={`/categories/:id/specs/:specId`}
            exact
            component={CategoryEditSpec}
          />
        </Switch>
      </Drawer>
    </>
  );
};
