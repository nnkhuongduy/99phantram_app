import { FC } from 'react';
import { Form, Input, Button, Space, Select } from 'antd';

import { ServiceValue } from 'src/models/service';
import { ServiceType } from 'src/models/service-type';

interface Props {
  type: ServiceType;
  onFinish: (value: ServiceValue) => void;
  value?: ServiceValue;
}

export const ServiceValueDrawer: FC<Props> = ({ type, onFinish, value = {} }) => {
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
        label="Giá trị"
        name="type"
        rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
      >
        <Input />
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
