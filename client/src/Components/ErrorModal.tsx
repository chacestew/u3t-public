import React from 'react';
import styled from 'styled-components';

import palette from '../utils/palette';
import { ButtonLink } from './Button';

const ModalContainer = styled.div`
  padding: 2em;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  background-color: ${palette.primaryLight};
  color: ${palette.white};
`;

const Paragraph = styled.p`
  white-space: nowrap;
`;

const ButtonContainer = styled.div`
  margin-top: 1em;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export default function ErrorModal() {
  return (
    <ModalContainer>
      <Paragraph>Game not found or has expired.</Paragraph>
      <ButtonContainer>
        <ButtonLink $rounded $shadow to="/">
          Back to home
        </ButtonLink>
      </ButtonContainer>
    </ModalContainer>
  );
}
