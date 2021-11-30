import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Transfer, Row, Col, Button, message } from 'antd';
import styled from 'styled-components';

import { Location, LocationStatus } from 'src/models/location';
import {
  useGetLocationsQuery,
  useGetLocationQuery,
  useUpdateLocationMutation,
} from 'src/services/location';
import { useHttpError } from 'src/hooks/http';

const MainRow = styled(Row)`
  .ant-transfer-list {
    width: 50%;
    height: 80vh;
    min-height: 400px;
  }
`;

export const SubLocations = () => {
  const history = useHistory();
  const { id: locationId } = useParams<{ id: string }>();
  const httpErrorHandler = useHttpError();

  const { data: locations } = useGetLocationsQuery();
  const { data: currentLocation } = useGetLocationQuery(locationId, {
    refetchOnMountOrArgChange: true,
  });
  const [updateLocation] = useUpdateLocationMutation();

  const [selectableCategories, setSelectableCategories] = useState<Location[]>(
    []
  );
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (locations && currentLocation) {
      setSelectableCategories(
        locations.filter(
          (_) =>
            _.id !== locationId &&
            _.locationLevel === currentLocation.locationLevel + 1 &&
            _.status !== LocationStatus.ARCHIVED
        )
      );
    }
    if (currentLocation) {
      setTargetKeys(currentLocation.subLocationsRef || []);
    }
    //eslint-disable-next-line
  }, [locations, currentLocation]);

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onSave = async () => {
    try {
      const { name, locationLevel, status } = currentLocation!;

      await updateLocation({
        id: locationId,
        form: {
          name,
          locationLevel,
          status,
          subLocations: targetKeys,
        },
      }).unwrap();

      message.success('Địa điểm con đã được cập nhật thành công!');
      history.push('/locations');
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <MainRow gutter={[8, 8]}>
      <Col span={24} style={{ textAlign: 'end' }}>
        <Button type="primary" onClick={onSave}>
          Lưu
        </Button>
      </Col>
      <Col span={24}>
        <Transfer
          dataSource={selectableCategories}
          titles={['Có thể chọn', 'Địa điểm con']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          render={(item) => item.name}
          oneWay
          onChange={onChange}
          onSelectChange={onSelectChange}
          rowKey={(item) => item.id}
        />
      </Col>
    </MainRow>
  );
};
