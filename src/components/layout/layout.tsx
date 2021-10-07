import { FC } from 'react';
import { Layout as AntLayout } from 'antd';

import { Header } from '../header/header';
import { Sider } from '../sider/sider';
import { useAppSelector } from 'src/hooks/store';
import { selectCurrentUser } from 'src/slices/auth';

const { Footer, Content } = AntLayout;

export const Layout: FC = ({ children }) => {
  const currentUser = useAppSelector(selectCurrentUser);

  if (currentUser) {
    return (
      <AntLayout style={{ minHeight: '100vh' }}>
        <Sider />
        <AntLayout>
          <Header />
          <Content style={{ margin: '10px' }}>{children}</Content>
          <Footer></Footer>
        </AntLayout>
      </AntLayout>
    );
  }

  return <>{children}</>;
};
