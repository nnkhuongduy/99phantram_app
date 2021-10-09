import { message } from 'antd';
import { useHistory } from 'react-router-dom';

import { HttpError } from 'src/models/http-error';
import { useAppDispatch, useAppSelector } from './store';
import { logout, selectCurrentUser } from 'src/slices/auth';

export const useHttpError = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const history = useHistory();

  return (error: any) => {
    if (error.data) {
      message.error((error.data as HttpError).message);

      if ((error.data as HttpError).code === 400 && currentUser) {
        dispatch(logout());

        history.push('/login');
      }

      return;
    }

    message.error(
      'Đã xảy ra lỗi trong quá trình đăng nhập! Xin vui lòng thử lại sau.'
    );
  };
};
