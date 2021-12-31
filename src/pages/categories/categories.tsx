import { FC, useEffect, useState } from 'react';
import { Row, Col, Input, Select, Button, Drawer } from 'antd';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  useHistory,
  Route,
  Switch,
  useLocation,
  useParams,
} from 'react-router-dom';

import { useHeaderTitle } from 'src/hooks/header-title';
import { CategoriesTable } from './table';
import { Category } from 'src/models/category';
import { useGetCategoriesQuery } from 'src/services/category';
import { AddCategory } from './add/add';
import { EditCategory } from './edit/edit';
import { CategorySpecsTable } from './spec/table';
import { SubCategories } from './sub-categories/sub-categories';

const { Group, Search } = Input;

export const CategoriesPage: FC = () => {
  useHeaderTitle('Danh sách danh mục');

  const history = useHistory();
  const location = useLocation();
  const { id: categoryId } = useParams<{ id: string }>();

  const [visible, setVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>();
  const [query, setQuery] = useState<string>('');
  const [_categories, _setCategories] = useState<Category[]>([]);

  const { data: categories, isFetching } = useGetCategoriesQuery();

  useEffect(() => {
    if (location.pathname === '/categories') {
      setVisible(false);
    } else if (categoryId && categoryId.length === 24) {
      setVisible(true);
      setDrawerTitle('Sửa thông tin danh mục');
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    filter();
    //eslint-disable-next-line
  }, [categories]);

  const filter = () => {
    if (categories) {
      _setCategories(
        categories.filter((_) =>
          _.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const onAdd = () => {
    history.push('/categories/add');
    setVisible(true);
    setDrawerTitle('Thêm danh mục');
  };

  const onEdit = (category: Category) => {
    history.push('/categories/' + category.id);
    setVisible(true);
    setDrawerTitle('Sửa thông tin danh mục');
  };

  const onSpecs = (category: Category) => {
    history.push('/categories/' + category.id + '/specs');
    setVisible(true);
    setDrawerTitle('Chi tiết danh mục');
  };

  const onSubCategories = (category: Category) => {
    history.push('/categories/' + category.id + '/sub-categories');
    setVisible(true);
    setDrawerTitle('Danh mục con');
  };

  const onClose = () => {
    history.push('/categories');
  };

  return (
    <>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={12}>
              <Group compact>
                <Search
                  addonBefore={
                    <Select value={'name'}>
                      <Select.Option value="name">Tên</Select.Option>
                    </Select>
                  }
                  placeholder="Tìm kiếm..."
                  enterButton
                  value={query}
                  onChange={(value) => setQuery(value.target.value)}
                  onSearch={filter}
                ></Search>
              </Group>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<AiOutlinePlus className="app-icon" />}
                onClick={onAdd}
              >
                Thêm
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <CategoriesTable
            onEdit={onEdit}
            onSpecs={onSpecs}
            onSubCategories={onSubCategories}
            data={_categories}
            isLoading={isFetching}
          />
        </Col>
        <Col span={24}></Col>
      </Row>
      <Drawer
        title={drawerTitle}
        placement="right"
        visible={visible}
        onClose={onClose}
        width={800}
        destroyOnClose
        maskClosable={false}
      >
        <Switch>
          <Route path="/categories/add" exact component={AddCategory} />
          <Route path="/categories/:id" exact component={EditCategory} />
          <Route path="/categories/:id/specs" component={CategorySpecsTable} />
          <Route
            path="/categories/:id/sub-categories"
            component={SubCategories}
          />
        </Switch>
      </Drawer>
    </>
  );
};
