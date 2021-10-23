import { FC, useState, useEffect } from 'react';
import { Upload, Space, message, Avatar } from 'antd';
import { AiOutlineLoading, AiOutlinePlus } from 'react-icons/ai';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

interface UploadAvatarProps {
  file?: UploadFile;
  defaultUrl?: string;
  onUpload: (file: UploadFile) => void;
}

const getBase64 = (img: any, callback: any) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const fileChecking = (file: UploadFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Bạn chỉ có thể tài lên file JPG/PNG!');
  }
  const isLt2M = file.size! / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Ảnh không được vướt quá 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export const UploadAvatar: FC<UploadAvatarProps> = ({ file, defaultUrl, onUpload }) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      getBase64(file, (imageUrl: string) => {
        setLoading(false);
        setImageUrl(imageUrl);
      });
    } else {
      setImageUrl(undefined);
    }
  }, [file]);

  const onChange = (info: UploadChangeParam) => {
    if (fileChecking(info.file)) {
      setLoading(true);
      onUpload(info.file);
    }
  };

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      showUploadList={false}
      onChange={onChange}
      beforeUpload={() => false}
      accept="image/*"
    >
      {(imageUrl || defaultUrl) ? (
        <Avatar
          src={imageUrl || defaultUrl}
          alt="avatar"
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <Space direction="vertical">
          <div>{loading ? <AiOutlineLoading /> : <AiOutlinePlus />}</div>
          <span>Tải lên</span>
        </Space>
      )}
    </Upload>
  );
};
