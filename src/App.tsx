import { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Spin } from 'antd';

import { PrivateRoute } from './components/private-route/private-route';

import { LoginPage } from './pages/login/login';
import { HomePage } from './pages/home/home';

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
    <Switch>
      <PrivateRoute path="/" exact>
        <HomePage />
      </PrivateRoute>
      <Route path="/login" exact>
        <LoginPage />
      </Route>
      <PrivateRoute path="*"></PrivateRoute>
    </Switch>
  );
}

export default App;
