import { FC, useState, useEffect } from 'react';
import { Form, Input, Button, Space, message, Drawer } from 'antd';
import { useHistory, Switch, Route, useLocation } from 'react-router-dom';

import {
  ServiceTypeForm,
  ServiceTypeStatus,
  ServiceTypeValue,
} from 'src/models/service-type';
import { useCreateServiceTypeMutation } from 'src/services/service-type';
import { useHttpError } from 'src/hooks/http';
import { ServiceTypeValueTable } from '../value-table';
import { ServiceTypeAddValue } from '../value';

export const AddServiceType: FC = () => {
  const [form] = Form.useForm();

  const [createServiceType, { isLoading }] = useCreateServiceTypeMutation();

  const httpErrorHandler = useHttpError();
  const history = useHistory();
  const location = useLocation();

  const [values, setValues] = useState<ServiceTypeValue[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(0);

  useEffect(() => {
    if (location.pathname === '/service-types/add') {
      setVisible(false);
    }
    //eslint-disable-next-line
  }, [location]);

  const onFinish = async (value: ServiceTypeForm) => {
    try {
      value.value = values.reduce(
        (result, { key, type }) => ({
          ...result,
          [key]: type,
        }),
        {}
      );
      value.status = ServiceTypeStatus.ACTIVE;
      await createServiceType(value).unwrap();

      clearForm();
      message.success('Loại dịch vụ mới đã được tạo thành công!');
      history.push('/service-types');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const clearForm = () => {
    form.resetFields();
  };

  const onClose = () => {
    history.push('/service-types/add');
  };

  const onAdd = () => {
    history.push('/service-types/add/add-value');
    setVisible(true);
  };

  const onEdit = (index: number) => {
    setEditingIndex(index);
    history.push('/service-types/add/edit-value');
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
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Thêm
            </Button>
            <Button htmlType="button" onClick={clearForm}>
              Nhập lại
            </Button>
          </Space>
        </Form.Item>
      </Form>
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
            path="/service-types/add/add-value"
            exact
            render={(routeProps) => (
              <ServiceTypeAddValue onFinish={onAddValue} {...routeProps} />
            )}
          />
          <Route
            path="/service-types/add/edit-value"
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
