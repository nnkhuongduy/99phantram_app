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
import { ServiceTypesTable } from './table';
import { ServiceType } from 'src/models/service-type';
import { useGetServiceTypesQuery } from 'src/services/service-type';
import { AddServiceType } from './add/add';
import { EditServiceType } from './edit/edit';

const { Group, Search } = Input;

export const ServiceTypesPage: FC = () => {
  useHeaderTitle('Danh sách loại dịch vụ');

  const history = useHistory();
  const location = useLocation();
  const { id: serviceTypeId } = useParams<{ id: string }>();

  const [visible, setVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>();
  const [query, setQuery] = useState<string>('');
  const [_serviceTypes, _setServiceTypes] = useState<ServiceType[]>([]);

  const { data: serviceTypes, isFetching } = useGetServiceTypesQuery();

  useEffect(() => {
    if (location.pathname === '/service-types') {
      setVisible(false);
    } else if (serviceTypeId) {
      setVisible(true);
      setDrawerTitle('Sửa thông tin loại dịch vụ');
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    filter();
    //eslint-disable-next-line
  }, [serviceTypes]);

  const filter = () => {
    if (serviceTypes) {
      _setServiceTypes(
        serviceTypes.filter((_) =>
          _.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const onAdd = () => {
    history.push('/service-types/add');
    setVisible(true);
    setDrawerTitle('Thêm loại dịch vụ');
  };

  const onEdit = (serviceType: ServiceType) => {
    history.push('/service-types/' + serviceType.id);
    setVisible(true);
    setDrawerTitle('Sửa thông tin loại dịch vụ');
  };

  const onClose = () => {
    history.push('/service-types');
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
          <ServiceTypesTable
            onEdit={onEdit}
            data={_serviceTypes}
            isLoading={isFetching}
          />
        </Col>
        <Col span={24}></Col>
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
          <Route path="/service-types/add" component={AddServiceType} />
          <Route path="/service-types/:id" component={EditServiceType} />
        </Switch>
      </Drawer>
    </>
  );
};
