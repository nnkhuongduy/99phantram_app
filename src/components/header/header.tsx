import { FC } from 'react';
import { PageHeader, Row, Col, Space, Menu, Dropdown, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';

import { HeaderStyled, AvatarStyled } from './styled';
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
                icon={<AvatarStyled user={currentUser!} alt="Avatar" />}
                shape="circle"
                style={{ padding: '0' }}
              ></Button>
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </HeaderStyled>
  );
};
