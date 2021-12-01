import { FC, useEffect, useState } from 'react';
import { Row, Col, Input, Select, Button, Drawer } from 'antd';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  useHistory,
  Route,
  Switch,
  useLocation,
  useParams,
} from 'react-router-dom';

import { useHeaderTitle } from 'src/hooks/header-title';
import { LocationTable } from './table';
import { Location } from 'src/models/location';
import { useGetLocationsQuery } from 'src/services/location';
import { AddLocation } from './add/add';
import { EditLocation } from './edit/edit';
import { SubLocations } from './sub-locations/sub-locations';

const { Group, Search } = Input;

export const LocationsPage: FC = () => {
  useHeaderTitle('Danh sách địa điểm');

  const history = useHistory();
  const location = useLocation();
  const { id: locationId } = useParams<{ id: string }>();

  const [visible, setVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>();
  const [query, setQuery] = useState<string>('');
  const [_locations, _setLocations] = useState<Location[]>([]);

  const { data: locations, isFetching } = useGetLocationsQuery();

  useEffect(() => {
    if (location.pathname === '/locations') {
      setVisible(false);
    } else if (locationId && locationId.length === 24) {
      setVisible(true);
      setDrawerTitle('Sửa thông tin địa điểm');
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    filter();
    //eslint-disable-next-line
  }, [locations]);

  const filter = () => {
    if (locations) {
      _setLocations(
        locations.filter((_) =>
          _.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const onAdd = () => {
    history.push('/locations/add');
    setVisible(true);
    setDrawerTitle('Thêm địa điểm');
  };

  const onEdit = (location: Location) => {
    history.push('/locations/' + location.id);
    setVisible(true);
    setDrawerTitle('Sửa thông tin địa điểm');
  };

  const onSubLocations = (location: Location) => {
    history.push('/locations/' + location.id + '/sub-locations');
    setVisible(true);
    setDrawerTitle('Địa điểm con');
  };

  const onClose = () => {
    history.push('/locations');
  };

  return (
    <>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={12}>
              <Group compact>
                <Search
                  addonBefore={
                    <Select value={'name'}>
                      <Select.Option value="name">Tên</Select.Option>
                    </Select>
                  }
                  placeholder="Tìm kiếm..."
                  enterButton
                  value={query}
                  onChange={(value) => setQuery(value.target.value)}
                  onSearch={filter}
                ></Search>
              </Group>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<AiOutlinePlus className="app-icon" />}
                onClick={onAdd}
              >
                Thêm
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <LocationTable
            onEdit={onEdit}
            onSubLocations={onSubLocations}
            data={_locations}
            isLoading={isFetching}
          />
        </Col>
      </Row>
      <Drawer
        title={drawerTitle}
        placement="right"
        visible={visible}
        onClose={onClose}
        width={800}
        destroyOnClose
        maskClosable={false}
      >
        <Switch>
          <Route path="/locations/add" exact component={AddLocation} />
          <Route path="/locations/:id" exact component={EditLocation} />
          <Route path="/locations/:id/sub-locations" component={SubLocations} />
        </Switch>
      </Drawer>
    </>
  );
};
