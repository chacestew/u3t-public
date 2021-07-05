import React from 'react';
import styled from 'styled-components';

import { Bar } from '../styles';

const SkeletonContent = styled.div`
  height: 2em;
`;

const Loading = () => (
  <Bar>
    <SkeletonContent />
  </Bar>
);

export default Loading;
