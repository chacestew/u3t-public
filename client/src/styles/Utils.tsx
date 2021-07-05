import styled from 'styled-components';

import { flexColumns } from './mixins';

export const RelativeBox = styled.div`
  ${flexColumns}
  height: calc(100vh - 172px);
  position: relative;
  overflow: auto;
`;
