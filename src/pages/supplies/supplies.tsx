import { FC, useEffect, useState } from 'react';
import { Row, Col, Input, Select, Drawer } from 'antd';
import {
  useHistory,
  Route,
  Switch,
  useLocation,
  useParams,
} from 'react-router-dom';

import { useHeaderTitle } from 'src/hooks/header-title';
import { SupplyTable } from './table';
import { useGetSuppliesQuery } from 'src/services/supply';
import { Supply } from 'src/models/supply';
import { SupplyDetail } from './detail';

const { Group, Search } = Input;

interface Query {
  type: 'name' | 'owner';
  query: string;
}

const DEFAULT_QUERY: Query = {
  type: 'name',
  query: '',
};

export const SuppliesPage: FC = () => {
  useHeaderTitle('Danh sách bài đăng sản phẩm');

  const history = useHistory();
  const location = useLocation();
  const { id: supplyId } = useParams<{ id: string }>();

  const [visible, setVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>();
  const [query, setQuery] = useState<Query>(DEFAULT_QUERY);
  const [_supplies, _setSupplies] = useState<Supply[]>([]);

  const { data: supplies, isFetching } = useGetSuppliesQuery();

  useEffect(() => {
    if (location.pathname === '/supplies') {
      setVisible(false);
    } else if (supplyId) {
      setVisible(true);
      setDrawerTitle('Xem thông tin bài đăng');
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    filter();
    //eslint-disable-next-line
  }, [supplies]);

  const filter = () => {
    if (supplies) {
      _setSupplies(
        supplies.filter((_) =>
          query.type === 'name'
            ? _.name.toLowerCase().includes(query.query.toLowerCase())
            : `${_.owner.lastName} ${_.owner.firstName}`
                .toLowerCase()
                .includes(query.query.toLowerCase())
        )
      );
    }
  };

  const onInfo = (supply: Supply) => {
    history.push('/supplies/' + supply.id);
    setVisible(true);
    setDrawerTitle('Xem thông tin bài đăng');
  };

  const onClose = () => {
    history.push('/supplies');
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
                    <Select
                      value={query.type}
                      onChange={(type: 'name' | 'owner') =>
                        setQuery({ ...query, type })
                      }
                    >
                      <Select.Option value="name">Tên</Select.Option>
                      <Select.Option value="owner">Người đăng</Select.Option>
                    </Select>
                  }
                  placeholder="Tìm kiếm..."
                  enterButton
                  value={query.query}
                  onChange={(event) => setQuery({ ...query, query: event.target.value })}
                  onSearch={filter}
                ></Search>
              </Group>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <SupplyTable
            onInfo={onInfo}
            data={_supplies}
            isLoading={isFetching}
          />
        </Col>
      </Row>
      <Drawer
        title={drawerTitle}
        placement="right"
        visible={visible}
        onClose={onClose}
        width={1200}
        destroyOnClose
        maskClosable={false}
      >
        <Switch>
          <Route path="/supplies/:id" exact component={SupplyDetail} />
        </Switch>
      </Drawer>
    </>
  );
};
