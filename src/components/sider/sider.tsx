import { FC, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import { DividerStyled } from './styled';
import { MENU_ITEMS } from './menu-items';

export const Sider: FC = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setSelectedKeys(
      MENU_ITEMS.filter((item) => {
        return item.exact
          ? location.pathname === item.path
          : location.pathname.includes(item.path);
      }).map((item) => item.id)
    );
  }, [location]);

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
    >
      <div style={{ textAlign: 'center' }}>
        <img
          src={
            collapsed
              ? '/assets/images/Icon-500px.png'
              : '/assets/images/Logo-Primarycolor.png'
          }
          alt="Logo"
          width={collapsed ? "50%" : "90%"}
          style={{ margin: '20px 0' }}
        />
      </div>

      <DividerStyled />

      <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
        {MENU_ITEMS.map(({ title, Icon, path, id }) => (
          <Menu.Item key={id} icon={Icon}>
            <Link to={path}>{title}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Layout.Sider>
  );
};
