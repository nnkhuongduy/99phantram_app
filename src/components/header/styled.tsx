import styled from 'styled-components';
import { Layout } from 'antd';
import { Avatar } from '../avatar/avatar';

export const HeaderStyled = styled(Layout.Header)`
  background: ${(props) => props.theme.colors.secondary.main};
  padding: 0 20px;
`;

export const AvatarStyled = styled(Avatar)`
  position: relative;
  top: -1px;
  left: -1px;
`;
