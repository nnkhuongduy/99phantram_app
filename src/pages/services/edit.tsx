import { FC } from 'react';
import { Form, Input, Button, Space, message, Switch, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';

import { ServiceForm } from 'src/models/service';
import { ServiceTypeValueType } from 'src/models/service-type';
import {
  useUpdateServiceMutation,
  useGetServiceQuery,
} from 'src/services/service';
import { useHttpError } from 'src/hooks/http';

export const EditService: FC = () => {
  const [form] = Form.useForm();
  const { id: serviceId } = useParams<{ id: string }>();

  const [updateService, { isLoading }] = useUpdateServiceMutation();
  const { data: service, isFetching: isFetchingService } =
    useGetServiceQuery(serviceId);

  const httpErrorHandler = useHttpError();
  const history = useHistory();

  const onFinish = async (value: ServiceForm) => {
    try {
      await updateService({ id: serviceId, form: value }).unwrap();

      clearForm();
      message.success('Dịch vụ đã được cập nhật thành công!');
      history.push('/services');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const clearForm = () => {
    form.resetFields();
  };

  return (
    <>
      {isFetchingService ? <Spin size="large" /> : null}
      {service ? (
        <Form
          scrollToFirstError
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          requiredMark={false}
          form={form}
          onFinish={onFinish}
          initialValues={{
            ...service,
          }}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>

          {Object.keys(service.serviceType.value).map((key) => (
            <Form.Item
              key={key}
              label={key}
              name={['value', key]}
              rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
            >
              {service.serviceType.value[key] ===
              ServiceTypeValueType.STRING ? (
                <Input />
              ) : service.serviceType.value[key] ===
                ServiceTypeValueType.NUMBER ? (
                <Input type="number" />
              ) : (
                <Switch />
              )}
            </Form.Item>
          ))}

          <Form.Item
            wrapperCol={{ span: 18, offset: 6 }}
            style={{ marginTop: '16px' }}
          >
            <Space>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Cập nhật
              </Button>
              <Button htmlType="button" onClick={clearForm}>
                Nhập lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ) : null}
    </>
  );
};
