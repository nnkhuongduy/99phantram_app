import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Transfer, Row, Col, Button, message, Input } from 'antd';
import styled from 'styled-components';

import { Category, CategoryLevel, CategoryStatus } from 'src/models/category';
import {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from 'src/services/category';
import { useHttpError } from 'src/hooks/http';

const MainRow = styled(Row)`
  .ant-transfer-list {
    width: 50%;
    height: 80vh;
    min-height: 400px;
  }
`;

export const SubCategories = () => {
  const history = useHistory();
  const { id: categoryId } = useParams<{ id: string }>();
  const httpErrorHandler = useHttpError();

  const { data: categories } = useGetCategoriesQuery();
  const { data: currentCategory } = useGetCategoryQuery(categoryId, {
    refetchOnMountOrArgChange: true,
  });
  const [updateCategory] = useUpdateCategoryMutation();

  const [secondaryCategories, setSecondaryCategories] = useState<Category[]>(
    []
  );
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (categories) {
      setSecondaryCategories(
        categories.filter(
          (_) =>
            _.id !== categoryId &&
            _.categoryLevel === CategoryLevel.SECONDARY &&
            _.status !== CategoryStatus.ARCHIVED
        )
      );
    }
    if (currentCategory) {
      setTargetKeys(currentCategory.subCategories);
    }
    //eslint-disable-next-line
  }, [categories, currentCategory]);

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onSave = async () => {
    try {
      if (query.length > 0) {
        alert('Vui lòng để trống input tìm kiếm!');
        return;
      }

      const { name, image, categoryLevel, status, specs, slug } =
        currentCategory!;

      await updateCategory({
        id: categoryId,
        form: {
          name,
          image,
          categoryLevel,
          status,
          specs: specs.map((_) => _.id),
          subCategories: targetKeys,
          slug,
        },
      }).unwrap();

      message.success('Danh mục con đã được cập nhật thành công!');
      history.push('/categories');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <MainRow gutter={[8, 8]}>
      <Col span={24} style={{ textAlign: 'end' }}>
        <Row justify="space-between">
          <Col>
            <Input.Search
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={onSave}>
              Lưu
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Transfer
          dataSource={secondaryCategories.filter((_) =>
            _.name.toLowerCase().includes(query)
          )}
          titles={['Có thể chọn', 'Danh mục con']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          render={(item) => item.name}
          oneWay
          onChange={onChange}
          onSelectChange={onSelectChange}
          rowKey={(item) => item.id}
        />
      </Col>
    </MainRow>
  );
};
