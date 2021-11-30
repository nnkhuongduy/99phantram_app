import {
  AiOutlineUser,
  AiFillFolder,
  AiFillEnvironment,
  AiFillGold,
  AiOutlineBook,
} from 'react-icons/ai';
import { MdDashboard, MdClass } from 'react-icons/md';

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
  {
    id: 'Supplies',
    title: 'Bài đăng',
    Icon: <AiOutlineBook />,
    path: '/supplies',
    exact: false,
  },
  {
    id: 'Categories',
    title: 'Danh mục sản phẩm',
    Icon: <AiFillFolder />,
    path: '/categories',
    exact: false,
  },
  {
    id: 'Locations',
    title: 'Địa điểm',
    Icon: <AiFillEnvironment />,
    path: '/locations',
    exact: false,
  },
  {
    id: 'Service Types',
    title: 'Loại dịch vụ',
    Icon: <AiFillGold />,
    path: '/service-types',
    exact: false,
  },
  {
    id: 'Service',
    title: 'Dịch vụ',
    Icon: <MdClass />,
    path: '/services',
    exact: false,
  },
];
