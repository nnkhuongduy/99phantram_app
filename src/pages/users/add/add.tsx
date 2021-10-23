import { FC, useState } from 'react';
import { Form, Input, Button, Select, Space, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useHistory } from 'react-router-dom';

import { UploadAvatar } from '../upload';
import { useGetSelectableRolesQuery } from 'src/services/role';
import { UserForm } from 'src/models/user';
import { useCreateUserMutation } from 'src/services/user';
import { useHttpError } from 'src/hooks/http';
import { useUploadAvatarMutation } from 'src/services/file';

export const AddUser: FC = () => {
  const [avatar, setAvatar] = useState<UploadFile>();

  const [form] = Form.useForm();

  const { data: roles, isFetching } = useGetSelectableRolesQuery();
  const [createUser, {isLoading}] = useCreateUserMutation();
  const [uploadAvatar] = useUploadAvatarMutation();

  const httpErrorHandler = useHttpError();

  const history = useHistory();

  const onFinish = async (value: UserForm) => {
    try {
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar as any);

        const avatarUrl = (await uploadAvatar(formData).unwrap()).url;
        value.avatar = avatarUrl;
      }

      await createUser(value).unwrap();

      clearForm();
      message.success('Người dùng mới đã được tạo thành công!');
      history.push('/users');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const clearForm = () => {
    form.resetFields();
    setAvatar(undefined);
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
        name="firstName"
        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Họ"
        name="lastName"
        rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' },
          { min: 7, message: 'Mật khẩu ít nhất 7 ký tự!' },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Nhập lại mật khẩu"
        name="confirm"
        rules={[
          { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('Mật khẩu không trùng nhau!'));
            },
          }),
        ]}
        hasFeedback
        dependencies={['password']}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Giới tính"
        name="sex"
        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        wrapperCol={{ span: 6 }}
      >
        <Select>
          <Select.Option value={0}>Nam</Select.Option>
          <Select.Option value={1}>Nữ</Select.Option>
          <Select.Option value={2}>Khác</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Địa chỉ"
        name="address"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
      >
        <Input.TextArea autoSize={{ minRows: 2 }} />
      </Form.Item>

      <Form.Item
        label="SĐT"
        name="phoneNumber"
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          { len: 10, message: 'SĐT không hợp lệ!' },
        ]}
      >
        <Input type="tel" />
      </Form.Item>

      <Form.Item label="Ảnh đại diện">
        <UploadAvatar file={avatar} onUpload={(file) => setAvatar(file)} />
      </Form.Item>

      <Form.Item
        label="Vai trò"
        name="role"
        wrapperCol={{ span: 6 }}
        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
      >
        <Select loading={isFetching}>
          {roles?.map((role) => (
            <Select.Option value={role.id} key={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        wrapperCol={{ span: 6 }}
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select>
          <Select.Option value={1}>VERIFIED</Select.Option>
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
