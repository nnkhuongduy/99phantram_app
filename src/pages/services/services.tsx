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
import { ServicesTable } from './table';
import { Service } from 'src/models/service';
import { useGetServicesQuery } from 'src/services/service';
import { AddService } from './add';
import { EditService } from './edit';

const { Group, Search } = Input;

export const ServicesPage: FC = () => {
  useHeaderTitle('Danh sách dịch vụ');

  const history = useHistory();
  const location = useLocation();
  const { id: serviceId } = useParams<{ id: string }>();

  const [visible, setVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>();
  const [query, setQuery] = useState<string>('');
  const [_services, _setServices] = useState<Service[]>([]);

  const { data: services, isFetching } = useGetServicesQuery();

  useEffect(() => {
    if (location.pathname === '/services') {
      setVisible(false);
    } else if (serviceId) {
      setVisible(true);
      setDrawerTitle('Sửa thông tin dịch vụ');
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    filter();
    //eslint-disable-next-line
  }, [services]);

  const filter = () => {
    if (services) {
      _setServices(
        services.filter((_) =>
          _.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const onAdd = () => {
    history.push('/services/add');
    setVisible(true);
    setDrawerTitle('Thêm dịch vụ');
  };

  const onEdit = (service: Service) => {
    history.push('/services/' + service.id);
    setVisible(true);
    setDrawerTitle('Sửa thông tin dịch vụ');
  };

  const onClose = () => {
    history.push('/services');
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
          <ServicesTable
            onEdit={onEdit}
            data={_services}
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
          <Route path="/services/add" exact component={AddService} />
          <Route path="/services/:id" exact component={EditService} />
        </Switch>
      </Drawer>
    </>
  );
};
