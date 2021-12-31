import { FC, useState } from 'react';
import { Form, Input, Button, Space, message, Select, Switch } from 'antd';
import { useHistory } from 'react-router-dom';

import { ServiceForm, ServiceStatus } from 'src/models/service';
import { ServiceType, ServiceTypeValueType } from 'src/models/service-type';
import { useCreateServiceMutation } from 'src/services/service';
import { useGetServiceTypesQuery } from 'src/services/service-type';
import { useHttpError } from 'src/hooks/http';

export const AddService: FC = () => {
  const [form] = Form.useForm();

  const [createService, { isLoading }] = useCreateServiceMutation();
  const { data: serviceTypes, isFetching: isFetchingTypes } =
    useGetServiceTypesQuery();

  const httpErrorHandler = useHttpError();
  const history = useHistory();

  const [selectedType, setSelectedType] = useState<ServiceType>();

  const onFinish = async (value: ServiceForm) => {
    try {
      value.status = ServiceStatus.ACTIVE;

      await createService(value).unwrap();

      clearForm();
      message.success('Dịch vụ mới đã được tạo thành công!');
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
      <Form
        scrollToFirstError
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        requiredMark={false}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label="Loại dịch vụ"
          name="serviceType"
          wrapperCol={{ span: 6 }}
          rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ' }]}
        >
          <Select
            loading={isFetchingTypes}
            onChange={(typeId: string) =>
              setSelectedType((serviceTypes || []).find((_) => _.id === typeId))
            }
          >
            {(serviceTypes || []).map((type) => (
              <Select.Option key={type.id} value={type.id}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input />
        </Form.Item>

        {selectedType
          ? Object.keys(selectedType.value).map((key) => (
              <Form.Item
                key={key}
                label={key}
                name={['value', key]}
                rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
              >
                {selectedType.value[key] === ServiceTypeValueType.STRING ? (
                  <Input />
                ) : selectedType.value[key] === ServiceTypeValueType.NUMBER ? (
                  <Input type="number" />
                ) : (
                  <Switch />
                )}
              </Form.Item>
            ))
          : null}

        <Form.Item
          wrapperCol={{ span: 18, offset: 6 }}
          style={{ marginTop: '16px' }}
        >
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
    </>
  );
};
