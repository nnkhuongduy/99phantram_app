import { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';

import { PrivateRoute } from './components/private-route/private-route';
import { Layout } from './components/layout/layout';

import { LoginPage } from './pages/login/login';
import { HomePage } from './pages/home/home';
import { NotFoundPage } from './pages/404/404';
import { UsersPage } from './pages/users/users';
import { CategoriesPage } from './pages/categories/categories';
import { LocationsPage } from './pages/locations/locations';
import { ServiceTypesPage } from './pages/service-type/service-type';
import { ServicesPage } from './pages/services/services';
import { SuppliesPage } from './pages/supplies/supplies';

import { useLazyAuthenticateQuery } from './services/auth';
import { GLOBAL_CONSTANTS } from './constants/global';
import { useAppDispatch } from './hooks/store';
import { setJwtToken } from './slices/auth';
import './App.less';

function App() {
  const [authenticate, { isError, isSuccess }] = useLazyAuthenticateQuery();
  const dispatch = useAppDispatch();
  const [initialChecking, setInitialChecking] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(
      GLOBAL_CONSTANTS.LOCAL_STORE_JWT_TOKEN
    );

    if (storedToken) {
      dispatch(setJwtToken(storedToken));

      try {
        authenticate();
      } catch (error) {
        console.log(error);

        localStorage.removeItem(GLOBAL_CONSTANTS.LOCAL_STORE_JWT_TOKEN);
      }
    } else {
      setInitialChecking(true);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!initialChecking && (isError || isSuccess)) {
      setInitialChecking(true);
    }
    //eslint-disable-next-line
  }, [isError, isSuccess]);

  if (!initialChecking) {
    return (
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Spin size="large" />;
      </div>
    );
  }

  return (
    <Layout>
      <Switch>
        <PrivateRoute path="/" exact>
          <HomePage />
        </PrivateRoute>
        <PrivateRoute path="/users" exact>
          <UsersPage />
        </PrivateRoute>
        <PrivateRoute path="/users/:id">
          <UsersPage />
        </PrivateRoute>
        <PrivateRoute path="/supplies" exact>
          <SuppliesPage />
        </PrivateRoute>
        <PrivateRoute path="/supplies/:id">
          <SuppliesPage />
        </PrivateRoute>
        <PrivateRoute path="/categories" exact>
          <CategoriesPage />
        </PrivateRoute>
        <PrivateRoute path="/categories/:id">
          <CategoriesPage />
        </PrivateRoute>
        <PrivateRoute path="/locations" exact>
          <LocationsPage />
        </PrivateRoute>
        <PrivateRoute path="/locations/:id">
          <LocationsPage />
        </PrivateRoute>
        <PrivateRoute path="/service-types" exact>
          <ServiceTypesPage />
        </PrivateRoute>
        <PrivateRoute path="/service-types/:id">
          <ServiceTypesPage />
        </PrivateRoute>
        <PrivateRoute path="/services" exact>
          <ServicesPage />
        </PrivateRoute>
        <PrivateRoute path="/services/:id">
          <ServicesPage />
        </PrivateRoute>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <PrivateRoute path="*">
          <NotFoundPage />
        </PrivateRoute>
      </Switch>
    </Layout>
  );
}

export default App;
