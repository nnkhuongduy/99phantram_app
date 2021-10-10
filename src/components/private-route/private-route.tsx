import { FC } from 'react';
import { Redirect, RouteProps, Route } from 'react-router-dom';

import { useAppSelector } from 'src/hooks/store';
import { selectCurrentUser } from 'src/slices/auth';

export const PrivateRoute: FC<RouteProps> = ({ children, ...props }) => {
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <Route
      {...props}
      render={({ location }) =>
        currentUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
