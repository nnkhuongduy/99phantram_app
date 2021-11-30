import { FC } from 'react';
import { Form, Input, Button, Space, Select } from 'antd';

import { ServiceTypeValue } from 'src/models/service-type';

interface Props {
  onFinish: (value: ServiceTypeValue) => void;
  value?: ServiceTypeValue;
}

export const ServiceTypeAddValue: FC<Props> = ({ onFinish, value = {} }) => {
  const [form] = Form.useForm();

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
      initialValues={{ ...value }}
    >
      <Form.Item
        label="Tên"
        name="key"
        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Kiểu dữ liệu"
        name="type"
        rules={[{ required: true, message: 'Vui lòng nhập kiểu dữ liệu!' }]}
      >
        <Select>
          <Select.Option value={0}>String</Select.Option>
          <Select.Option value={1}>Number</Select.Option>
          <Select.Option value={2}>Boolean</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        wrapperCol={{ span: 18, offset: 6 }}
        style={{ marginTop: '16px' }}
      >
        <Space>
          <Button type="primary" htmlType="submit">
            {value.key ? 'Sửa' :'Thêm'}
          </Button>
          <Button htmlType="button" onClick={clearForm}>
            Nhập lại
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
