import { FC } from 'react';
import { Row, Col, Form, Input, Checkbox, Button, message } from 'antd';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import { Redirect } from 'react-router-dom';

import { BackgroundDark, BackgroundLight, CardStyled } from './styled';
import { AuthRequest } from 'src/models/auth';
import { useLoginMutation } from 'src/services/auth';
import { GLOBAL_CONSTANTS } from 'src/constants/global';
import { selectCurrentUser } from 'src/slices/auth';
import { useAppSelector } from 'src/hooks/store';
import { HttpError } from 'src/models/http-error';

const { useForm } = Form;

export const LoginPage: FC = () => {
  const [form] = useForm();
  const [login, { isLoading }] = useLoginMutation();
  const currentUser = useAppSelector(selectCurrentUser);

  const onFinish = async (value: AuthRequest) => {
    try {
      const { token } = await login(value).unwrap();

      message.success('Đăng nhập thành công!');

      localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORE_JWT_TOKEN, token);
    } catch (error: any) {
      message.error(
        error.data
          ? (error.data as HttpError).message
          : 'Đã xảy ra lỗi trong quá trình đăng nhập! Xin vui lòng thử lại sau.'
      );
    }
  };

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <Row>
      <Col span={24} md={12}>
        <BackgroundLight>
          <CardStyled>
            <div style={{ textAlign: 'center' }}>
              <img
                src="/assets/images/Logo-Primarycolor.png"
                alt="Logo"
                width="200px"
                style={{ marginBottom: '30px' }}
              />
            </div>

            <Form
              form={form}
              onFinish={onFinish}
              name="login"
              initialValues={{ remember: true }}
              requiredMark="optional"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                ]}
              >
                <Input prefix={<AiOutlineUser />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 7, message: 'Mật khẩu ít nhất 7 ký tự' },
                ]}
              >
                <Input
                  prefix={<AiOutlineLock />}
                  placeholder="Password"
                  type="password"
                />
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" disabled={isLoading}>
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </CardStyled>
        </BackgroundLight>
      </Col>
      <Col span={0} md={12}>
        <BackgroundDark />
      </Col>
    </Row>
  );
};