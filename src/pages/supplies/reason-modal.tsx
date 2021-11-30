import { FC } from 'react';
import { Form, Modal, Input, Typography } from 'antd';

interface Props {
  visible: boolean;
  title: string;
  content: string;
  okText: string;
  onSubmit: (value: { reason: string }) => void;
  onCancel: () => void;
}

export const ReasonModal: FC<Props> = ({
  visible,
  content,
  title,
  okText,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title={title}
      okText={okText}
      cancelText="Hủy"
      onOk={() =>
        form.validateFields().then((values) => {
          form.resetFields();
          onSubmit(values);
        })
      }
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Typography.Paragraph>{content}</Typography.Paragraph>
        <Form.Item
          label="Lý do"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
