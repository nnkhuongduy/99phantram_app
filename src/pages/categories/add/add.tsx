import { FC, useState } from 'react';
import { Form, Input, Button, Select, Space, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { UploadFile } from 'antd/lib/upload/interface';

import { CategoryPostForm } from 'src/models/category';
import { useCreateCategoryMutation } from 'src/services/category';
import { useHttpError } from 'src/hooks/http';
import { UploadImage } from 'src/components/upload/upload';
import { useUploadImageMutation } from 'src/services/file';

export const AddCategory: FC = () => {
  const [form] = Form.useForm();

  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  const httpErrorHandler = useHttpError();
  const history = useHistory();

  const [image, setImage] = useState<UploadFile>();

  const onFinish = async (value: CategoryPostForm) => {
    try {
      if (image) {
        const formData = new FormData();
        formData.append('image', image as any);

        const imageUrl = (await uploadImage(formData).unwrap()).url;
        value.image = imageUrl;
      }

      await createCategory(value).unwrap();

      clearForm();
      message.success('Danh mục sản phẩm mới đã được tạo thành công!');
      history.push('/categories');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

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
    >
      <Form.Item
        label="Tên"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Slug"
        name="slug"
        rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Cấp danh mục"
        name="categoryLevel"
        rules={[{ required: true, message: 'Vui lòng chọn cấp danh mục!' }]}
        wrapperCol={{ span: 6 }}
      >
        <Select>
          <Select.Option value={0}>PRIMARY</Select.Option>
          <Select.Option value={1}>SECONDARY</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Ảnh">
        <UploadImage
          name="image"
          file={image}
          onUpload={(file) => setImage(file)}
        />
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
