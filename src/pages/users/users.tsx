import { FC, useState } from 'react';
import { Row, Col, Input, Select, Button } from 'antd';
import { AiOutlinePlus } from 'react-icons/ai';

import { useHeaderTitle } from 'src/hooks/header-title';
import { UsersTable } from './table';
import { AddUser } from './add/add';

const { Group, Search } = Input;

export const UsersPage: FC = () => {
  useHeaderTitle('Danh sách người dùng');
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={12}>
              <Group compact>
                <Search
                  addonBefore={
                    <Select defaultValue="name">
                      <Select.Option value="name">Tên</Select.Option>
                      <Select.Option value="email">Email</Select.Option>
                      <Select.Option value="phoneNumber">SĐT</Select.Option>
                    </Select>
                  }
                  placeholder="Tìm kiếm..."
                  enterButton
                ></Search>
              </Group>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<AiOutlinePlus className="app-icon" />}
                onClick={() => setOpenAdd(true)}
              >
                Thêm
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <UsersTable />
        </Col>
        <Col span={24}></Col>
      </Row>
      <AddUser visible={openAdd} onClose={() => setOpenAdd(false)} />
    </>
  );
};
