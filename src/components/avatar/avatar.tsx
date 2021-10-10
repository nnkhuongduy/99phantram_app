import { FC } from 'react';
import { Avatar as AntAvatar, AvatarProps } from 'antd';
import { User } from 'src/models/user';

export const Avatar: FC<Omit<AvatarProps, 'src'> & { user: User }> = ({
  user,
  ...props
}) => {
  return (
    <AntAvatar src={user.avatar ? user.avatar.url : null} {...props}>
      {user.avatar ? undefined : user.firstName[0]}
    </AntAvatar>
  );
};
