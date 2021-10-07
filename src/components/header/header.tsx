import { FC } from 'react';
import { PageHeader, Row, Col, Button, Space, Menu, Dropdown } from 'antd';
import { useHistory } from 'react-router-dom';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';

import { HeaderStyled } from './styled';
import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { logout, selectCurrentUser } from 'src/slices/auth';
import { selectHeaderTitle } from 'src/slices/global';
import { GLOBAL_CONSTANTS } from 'src/constants/global';

export const Header: FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const headerTitle = useAppSelector(selectHeaderTitle);

  const onLogout = () => {
    dispatch(logout());

    localStorage.removeItem(GLOBAL_CONSTANTS.LOCAL_STORE_JWT_TOKEN);

    history.push('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<AiOutlineLogout />} onClick={onLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderStyled>
      <Row>
        <Col span={12}>
          <PageHeader onBack={() => history.goBack()} title={headerTitle} />
        </Col>
        <Col span={12} style={{ textAlign: 'end' }}>
          <Space wrap>
            <span>{currentUser?.firstName + ' ' + currentUser?.lastName}</span>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                icon={
                  <AiOutlineUser style={{ width: '20px', height: '22px' }} />
                }
                shape="circle"
              ></Button>
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </HeaderStyled>
  );
};
