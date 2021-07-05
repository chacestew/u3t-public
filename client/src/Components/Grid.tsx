import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  position: relative;
`;

export default Grid;
