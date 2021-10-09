import { FC, useEffect } from 'react';

import { useAppDispatch } from 'src/hooks/store';
import { setHeaderTitle } from 'src/slices/global';

export const HomePage: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHeaderTitle('Giao diện chính'));
    //eslint-disable-next-line
  }, []);

  return <div></div>;
};
