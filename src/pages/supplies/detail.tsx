import { FC, Fragment } from 'react';
import {
  Descriptions,
  Spin,
  Typography,
  Tag,
  Tabs,
  Image,
  Row,
  Col,
} from 'antd';
import { useParams, Link } from 'react-router-dom';
import dayjs from 'dayjs';

import { useGetSupplyQuery } from 'src/services/supply';
import { Avatar } from 'src/components/avatar/avatar';
import { SUPPLY_CONSTANTS } from 'src/constants/supply';
import { SupplyStatus, ProductStatus } from 'src/models/supply';
import {
  getCategoryText,
  formatPrice,
  getLocationText,
} from 'src/helpers/helpers';
import { AuditTab } from './audit';

const { TabPane } = Tabs;

export const SupplyDetail: FC = () => {
  const { id: supplyId } = useParams<{ id: string }>();

  const { data: supply, isFetching: isSupplyFetching } =
    useGetSupplyQuery(supplyId);

  if (isSupplyFetching) return <Spin size="large"></Spin>;

  return (
    <>
      {isSupplyFetching ? (
        <Spin size="large"></Spin>
      ) : supply ? (
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Thông tin" key="1">
            <Descriptions
              title="Chi tiết bài đăng"
              layout="vertical"
              bordered
              size="small"
            >
              <Descriptions.Item label="Tên">
                {supply.name} ({ProductStatus[supply.productStatus]})
              </Descriptions.Item>
              <Descriptions.Item label="Người đăng">
                <Link to={`/users/${supply.owner.id}`}>
                  <Avatar size={30} user={supply.owner} />
                  <Typography.Text style={{ marginLeft: '5px' }}>
                    {supply.owner.lastName} {supply.owner.firstName}
                  </Typography.Text>
                </Link>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={SUPPLY_CONSTANTS.STATUS_COLOR[supply.status]}>
                  {SupplyStatus[supply.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                {getLocationText(supply)}
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                {formatPrice(supply.price)}
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                {getCategoryText(supply)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Mô tả"
                span={3}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {supply.description}
              </Descriptions.Item>
              <Descriptions.Item label="Chi tiết" span={3}>
                {supply.specs.map((spec) => (
                  <Fragment key={spec.parent}>
                    <span>
                      {spec.name}: {spec.value}
                    </span>
                    <br />
                  </Fragment>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng">
                {dayjs(supply.createdOn).format('L LTS')}
              </Descriptions.Item>
              <Descriptions.Item label="Lý do từ chối/ lưu trữ">
                {supply.reason}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="Ảnh" key="2">
            <Descriptions
              title="Ảnh của bài đăng"
              layout="vertical"
              bordered
              size="small"
            >
              <Descriptions.Item label="Ảnh chính" span={3}>
                <Image src={supply.thumbnail} height={220} />
              </Descriptions.Item>
              <Descriptions.Item label="Ảnh sản phẩm" span={3}>
                <Row gutter={[16, 16]}>
                  {supply.images.map((image) => (
                    <Col key={image}>
                      <Image src={image} height={400} />
                    </Col>
                  ))}
                </Row>
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="Kiểm duyệt" key="3">
            <AuditTab supply={supply} />
          </TabPane>
        </Tabs>
      ) : (
        <Typography.Title type="danger">
          Không tìm thấy bài đăng
        </Typography.Title>
      )}
    </>
  );
};
