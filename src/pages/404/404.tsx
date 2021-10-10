import { FC, useEffect } from 'react';
import { Empty } from 'antd';

import { useAppDispatch } from 'src/hooks/store';
import { setHeaderTitle } from 'src/slices/global';

export const NotFoundPage: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHeaderTitle('Không tìm thấy'));
    //eslint-disable-next-line
  }, []);
  
  return <Empty description="Trang này không tồn tại!" />;
};
