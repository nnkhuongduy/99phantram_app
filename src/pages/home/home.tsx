import { FC } from 'react';
import { useHeaderTitle } from 'src/hooks/header-title';

export const HomePage: FC = () => {
  useHeaderTitle('Giao diện chính');

  return <div></div>;
};
