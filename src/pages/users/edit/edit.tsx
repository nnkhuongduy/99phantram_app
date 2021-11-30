import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Space, message, Spin } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useHistory } from 'react-router-dom';

import { UploadImage } from 'src/components/upload/upload';
import { useGetSelectableRolesQuery } from 'src/services/role';
import { useGetUserQuery, useUpdateUserMutation } from 'src/services/user';
import { UserForm } from 'src/models/user';
import { useUploadAvatarMutation } from 'src/services/file';
import { useHttpError } from 'src/hooks/http';

const { useForm } = Form;

export const EditUser = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [form] = useForm();
  const httpErrorHandler = useHttpError();
  const history = useHistory();

  const [avatar, setAvatar] = useState<UploadFile>();

  const { isFetching: isRoleFetching, data: roles } =
    useGetSelectableRolesQuery();
  const { isFetching: isUserFetching, data: user } = useGetUserQuery(userId);
  const [uploadAvatar] = useUploadAvatarMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const onFinish = async (value: UserForm) => {
    try {
      if (user?.avatar) {
        value.avatar = user?.avatar;
      }

      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar as any);

        const avatarUrl = (await uploadAvatar(formData).unwrap()).url;
        value.avatar = avatarUrl;
      }

      await updateUser({ id: userId, form: value }).unwrap();

      clearForm();
      message.success('Thông tin người dùng đc cập nhật thành công!');
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
    <>
      {isUserFetching ? <Spin size="large" /> : null}
      {user ? (
        <Form
          scrollToFirstError
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          requiredMark={false}
          form={form}
          initialValues={{
            ...user,
            role: user.role.id,
          }}
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
              { message: 'Vui lòng nhập mật khẩu!' },
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
              { message: 'Vui lòng nhập lại mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error('Mật khẩu không trùng nhau!')
                  );
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
            <UploadImage
              name="avatar"
              file={avatar}
              defaultUrl={user.avatar}
              onUpload={(file) => setAvatar(file)}
            />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            wrapperCol={{ span: 6 }}
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select loading={isRoleFetching}>
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
