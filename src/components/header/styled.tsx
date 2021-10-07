import styled from 'styled-components';
import { Layout } from 'antd';

export const HeaderStyled = styled(Layout.Header)`
  background: ${(props) => props.theme.colors.secondary.main};
  padding: 0 20px;
`;
