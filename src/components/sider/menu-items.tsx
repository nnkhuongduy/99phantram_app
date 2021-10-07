import { AiOutlineUser } from 'react-icons/ai';
import { MdDashboard } from 'react-icons/md';

interface MenuItem {
  id: string;
  Icon: React.ReactNode;
  title: string;
  path: string;
  exact: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'Dashboard',
    title: 'Giao diện chính',
    Icon: <MdDashboard />,
    path: '/',
    exact: true,
  },
  {
    id: 'Users',
    title: 'Người dùng',
    Icon: <AiOutlineUser />,
    path: '/users',
    exact: false,
  },
];
