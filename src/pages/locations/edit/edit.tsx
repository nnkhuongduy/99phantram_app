import { useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Space, message, Spin } from 'antd';
import { useHistory } from 'react-router-dom';

import {
  useGetLocationQuery,
  useUpdateLocationMutation,
} from 'src/services/location';
import { useHttpError } from 'src/hooks/http';
import { LocationForm } from 'src/models/location';
const { useForm } = Form;

export const EditLocation = () => {
  const { id: locationId } = useParams<{ id: string }>();
  const [form] = useForm();
  const httpErrorHandler = useHttpError();
  const history = useHistory();

  const { isFetching: isLocationFetching, data: location } =
    useGetLocationQuery(locationId);
  const [updateLocation, { isLoading: isUpdating }] =
    useUpdateLocationMutation();

  const onFinish = async (value: LocationForm) => {
    try {
      await updateLocation({
        id: locationId,
        form: { ...location, ...value },
      }).unwrap();

      clearForm();
      message.success('Thông tin địa điểm đc cập nhật thành công!');
      history.push('/locations');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const clearForm = () => {
    form.resetFields();
  };

  return (
    <>
      {isLocationFetching ? <Spin size="large" /> : null}
      {location ? (
        <Form
          scrollToFirstError
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          requiredMark={false}
          form={form}
          initialValues={{
            ...location,
          }}
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
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Sửa
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
