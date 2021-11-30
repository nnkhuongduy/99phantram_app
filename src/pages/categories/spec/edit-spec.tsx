import { FC } from 'react';
import { Form, Input, Button, Space, message, Checkbox } from 'antd';
import { useHistory, useParams } from 'react-router-dom';

import { SpecForm } from 'src/models/spec';
import { useUpdateSpecMutation } from 'src/services/spec';
import { useGetCategoryQuery } from 'src/services/category';
import { useHttpError } from 'src/hooks/http';

export const CategoryEditSpec: FC = () => {
  const [form] = Form.useForm();
  const { id: categoryId, specId } =
    useParams<{ id: string; specId: string }>();

  const [updateSpec, { isLoading }] = useUpdateSpecMutation();
  const { data: category } = useGetCategoryQuery(categoryId);

  const httpErrorHandler = useHttpError();

  const history = useHistory();

  const onFinish = async (value: SpecForm) => {
    try {
      await updateSpec({ categoryId, specId, form: value }).unwrap();

      clearForm();
      message.success('Chi tiết danh mục đã được cập nhật thành công!');
      history.push('/categories/' + categoryId + '/specs');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const clearForm = () => {
    form.resetFields();
  };

  return (
    <Form
      scrollToFirstError
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      requiredMark={false}
      form={form}
      onFinish={onFinish}
      initialValues={{
        ...((category ?? { specs: [] }).specs.find((_) => _.id === specId) ??
          {}),
      }}
    >
      <Form.Item
        label="Nhãn"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập nhãn!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{ span: 18, offset: 6 }}
        name="required"
        valuePropName="checked"
      >
        <Checkbox>Bắt buộc</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Thêm
          </Button>
          <Button htmlType="button" onClick={clearForm}>
            Nhập lại
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
