import { FC, useState, useEffect } from 'react';
import { Form, Input, Button, Space, message, Drawer, Spin } from 'antd';
import {
  useHistory,
  Switch,
  Route,
  useLocation,
  useParams,
} from 'react-router-dom';

import { ServiceTypeForm, ServiceTypeValue } from 'src/models/service-type';
import {
  useGetServiceTypeQuery,
  useUpdateServiceTypeMutation,
} from 'src/services/service-type';
import { useHttpError } from 'src/hooks/http';
import { ServiceTypeValueTable } from '../value-table';
import { ServiceTypeAddValue } from '../value';

export const EditServiceType: FC = () => {
  const [form] = Form.useForm();

  const httpErrorHandler = useHttpError();
  const history = useHistory();
  const location = useLocation();
  const { id: serviceTypeId } = useParams<{ id: string }>();

  const [updateServiceType, { isLoading: isUpdating }] =
    useUpdateServiceTypeMutation();
  const { data: serviceType, isFetching: isServiceTypeLoading } =
    useGetServiceTypeQuery(serviceTypeId);

  const [values, setValues] = useState<ServiceTypeValue[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(0);

  useEffect(() => {
    if (location.pathname === `/service-types/${serviceTypeId}`) {
      setVisible(false);
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    if (serviceType) {
      const newValues = Object.keys(serviceType.value).map<ServiceTypeValue>(
        (key) => ({
          key,
          type: serviceType.value[key],
        })
      );

      setValues(newValues);
    }
    //eslint-disable-next-line
  }, [serviceType]);

  const onFinish = async (value: ServiceTypeForm) => {
    try {
      value.value = values.reduce(
        (result, { key, type }) => ({
          ...result,
          [key]: type,
        }),
        {}
      );

      await updateServiceType({ form: value, id: serviceTypeId }).unwrap();

      clearForm();
      message.success('Loại dịch vụ đã được cập nhật thành công!');
      history.push('/service-types');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const clearForm = () => {
    form.resetFields();
  };

  const onClose = () => {
    history.push('/service-types/' + serviceTypeId);
  };

  const onAdd = () => {
    history.push(`/service-types/${serviceTypeId}/add-value`);
    setVisible(true);
  };

  const onEdit = (index: number) => {
    setEditingIndex(index);
    history.push(`/service-types/${serviceTypeId}/edit-value`);
    setVisible(true);
  };

  const onDelete = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);

    setValues(newValues);
  };

  const onAddValue = (value: ServiceTypeValue) => {
    setValues([...values, value]);
    onClose();
  };

  const onEditValue = (value: ServiceTypeValue) => {
    const newValues = [...values];
    newValues[editingIndex] = value;

    setValues(newValues);
    onClose();
  };

  return (
    <>
      {isServiceTypeLoading ? <Spin size="large" /> : null}
      {serviceType ? (
        <Form
          scrollToFirstError
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          requiredMark={false}
          form={form}
          onFinish={onFinish}
          initialValues={{
            ...serviceType,
          }}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
            <Button htmlType="button" onClick={onAdd}>
              Thêm thiết lập
            </Button>
          </Form.Item>

          <ServiceTypeValueTable
            data={values}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          <Form.Item
            wrapperCol={{ span: 18, offset: 6 }}
            style={{ marginTop: '16px' }}
          >
            <Space>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Cập nhật
              </Button>
              <Button htmlType="button" onClick={clearForm}>
                Nhập lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ) : null}
      <Drawer
        title="Thêm thiết lập"
        placement="right"
        visible={visible}
        onClose={onClose}
        width={600}
        destroyOnClose
        maskClosable={false}
      >
        <Switch>
          <Route
            path="/service-types/:id/add-value"
            exact
            render={(routeProps) => (
              <ServiceTypeAddValue onFinish={onAddValue} {...routeProps} />
            )}
          />
          <Route
            path="/service-types/:id/edit-value"
            exact
            render={(routeProps) => (
              <ServiceTypeAddValue
                value={values[editingIndex]}
                onFinish={onEditValue}
                {...routeProps}
              />
            )}
          />
        </Switch>
      </Drawer>
    </>
  );
};
