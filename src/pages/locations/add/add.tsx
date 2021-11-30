import { FC } from 'react';
import { Form, Input, Button, Select, Space, message } from 'antd';
import { useHistory } from 'react-router-dom';

import { LocationForm } from 'src/models/location';
import { useCreateLocationMutation } from 'src/services/location';
import { useHttpError } from 'src/hooks/http';

export const AddLocation: FC = () => {
  const [form] = Form.useForm();

  const [createLocation, { isLoading }] = useCreateLocationMutation();

  const httpErrorHandler = useHttpError();
  const history = useHistory();

  const onFinish = async (value: LocationForm) => {
    try {
      value.subLocations = [];
      await createLocation(value).unwrap();

      clearForm();
      message.success('Địa điểm mới đã được tạo thành công!');
      history.push('/locations');
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
    >
      <Form.Item
        label="Tên"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Cấp địa điểm"
        name="locationLevel"
        rules={[{ required: true, message: 'Vui lòng chọn cấp địa điểm!' }]}
        wrapperCol={{ span: 6 }}
      >
        <Select>
          <Select.Option value={0}>PROVINCE</Select.Option>
          <Select.Option value={1}>WARD</Select.Option>
          <Select.Option value={2}>BLOCK</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        wrapperCol={{ span: 6 }}
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select>
          <Select.Option value={0}>NEW</Select.Option>
          <Select.Option value={1}>ACTIVE</Select.Option>
          <Select.Option value={2}>ARCHIVED</Select.Option>
        </Select>
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
