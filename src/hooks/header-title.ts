import { useAppDispatch } from './store';
import { setHeaderTitle as setHeaderTitleDispatch } from 'src/slices/global';
import { useCallback, useEffect } from 'react';

export const useHeaderTitle = (title: string) => {
  const dispatch = useAppDispatch();

  const setHeaderTitle = useCallback(() => {
    dispatch(setHeaderTitleDispatch(title));
    //eslint-disable-next-line
  }, [title]);

  useEffect(() => {
    setHeaderTitle();
    //eslint-disable-next-line
  }, [title]);
};
