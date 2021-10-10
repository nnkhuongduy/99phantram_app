import styled from 'styled-components';
import { Card } from 'antd';

const Background = styled.div`
  width: 100%;
  height: 100vh;
`;

export const BackgroundDark = styled(Background)`
  background: ${(props) => props.theme.colors.backgrounds.dark};
`;

export const BackgroundLight = styled(Background)`
  background: ${(props) => props.theme.colors.backgrounds.light};
  position: relative;
`;

export const CardStyled = styled(Card)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
`;
