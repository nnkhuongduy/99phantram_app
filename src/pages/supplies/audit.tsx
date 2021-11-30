import React, { FC, useEffect, useState } from 'react';
import { Row, Col, Button, message, Modal } from 'antd';
import { useHistory } from 'react-router-dom';

import { Supply, SupplyStatus, PutSupplyForm } from 'src/models/supply';
import { useHttpError } from 'src/hooks/http';
import {
  useUpdateSupplyMutation,
  useDeleteSupplyMutation,
} from 'src/services/supply';
import { ReasonModal } from './reason-modal';

interface Props {
  supply: Supply;
}

interface ModalProps {
  visible: boolean;
  title: string;
  okText: string;
  onSubmit: (value: { reason: string }) => void;
  content: string;
}

const DEFAULT_MODAL: ModalProps = {
  visible: false,
  title: '',
  okText: '',
  onSubmit: () => {},
  content: '',
};

export const AuditTab: FC<Props> = ({ supply }) => {
  const history = useHistory();
  const httpErrorHandler = useHttpError();

  const [globalDisabled, setGlobalDisabled] = useState(false);
  const [modalProps, setModalProps] = useState(DEFAULT_MODAL);

  const [updateSupply, { isLoading: isArchiving }] = useUpdateSupplyMutation();
  const [deleteSupply, { isLoading: isDeleting }] = useDeleteSupplyMutation();

  useEffect(() => {
    setGlobalDisabled(isArchiving || isDeleting);
  }, [isArchiving, isDeleting]);

  const onUpdate = async (
    status: SupplyStatus,
    sendEmail: boolean,
    reason?: string
  ) => {
    try {
      const form: PutSupplyForm = {
        status,
        sendEmail,
        reason,
      };
      await updateSupply({ id: supply.id, form }).unwrap();

      message.success('Cập nhật bài đăng thành công!');
      history.push('/supplies');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteSupply(supply.id).unwrap();

      message.success('Xóa bài đăng thành công!');
      history.push('/supplies');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const onSendEmail = (status: SupplyStatus, reason?: string) => {
    Modal.confirm({
      title: 'Gửi email thông báo!',
      content:
        'Bạn có muốn hệ thống gửi email thông báo đến người dùng về thao tác sắp được thực hiện?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => onUpdate(status, true, reason),
      onCancel: () => onUpdate(status, false, reason),
    });
  };

  const onAcceptModal = () => {
    Modal.confirm({
      title: 'Xác nhận bài đăng!',
      content: 'Bạn có muốn xác nhận kiểm duyệt bài đăng này?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => onSendEmail(SupplyStatus.ACTIVE),
    });
  };

  const onDeclineModal = () => {
    setModalProps({
      visible: true,
      title: 'Từ chối bài đăng!',
      okText: 'Từ chối',
      onSubmit: ({ reason }) => onSendEmail(SupplyStatus.DECLINED, reason),
      content: 'Cung cấp lý do từ chối bài đăng',
    });
  };

  const onArchiveModal = () => {
    setModalProps({
      visible: true,
      title: 'Xác nhận lưu trữ!',
      okText: 'Lưu trữ',
      onSubmit: ({ reason }) => onSendEmail(SupplyStatus.ARCHIVED, reason),
      content: 'Cung cấp lý do lưu trữ bài đăng',
    });
  };

  const onDeleteModal = () => {
    Modal.confirm({
      title: 'Xác nhận xóa!',
      content: 'Bạn có muốn xóa bài đăng này?',
      okText: 'Lưu trữ',
      cancelText: 'Hủy',
      onOk: () => onDelete(),
    });
  };

  return (
    <>
      <Row gutter={[16, 16]} justify="center">
        <Col>
          <Button
            disabled={supply.status !== SupplyStatus.WAITING || globalDisabled}
            type="primary"
            onClick={onAcceptModal}
          >
            Xác nhận bài đăng
          </Button>
        </Col>
        <Col>
          <Button
            disabled={supply.status !== SupplyStatus.WAITING || globalDisabled}
            onClick={onDeclineModal}
          >
            Từ chối bài đăng
          </Button>
        </Col>
        <Col>
          <Button
            disabled={supply.status !== SupplyStatus.ACTIVE || globalDisabled}
            danger
            onClick={onArchiveModal}
          >
            Lưu trữ bài đăng
          </Button>
        </Col>
        <Col>
          <Button
            disabled={
              (supply.status !== SupplyStatus.ARCHIVED &&
                supply.status !== SupplyStatus.DECLINED) ||
              globalDisabled
            }
            type="primary"
            danger
            onClick={onDeleteModal}
          >
            Xóa bài đăng
          </Button>
        </Col>
      </Row>
      <ReasonModal
        {...modalProps}
        onCancel={() => setModalProps(DEFAULT_MODAL)}
      />
    </>
  );
};
