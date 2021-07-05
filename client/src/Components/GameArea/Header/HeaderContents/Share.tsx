import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { Bar, Text } from '../styles';

const FLASH_DURATION = 500;

const flash = keyframes`
0%, 30% {
  color: black;
}
100% {
  color: inherit;
}
`;

const animation = css`
  animation: ${FLASH_DURATION}ms ${flash};
`;

const Container = styled(Text)`
  height: 2em;
  width: 100%;

  svg {
    margin-left: 0.5em;
  }
`;

const LinkContainer = styled.div`
  max-width: 50%;
  display: flex;
  font-weight: normal;
`;

const CopyToClipboard = styled.button<{ flashing: boolean }>`
  cursor: pointer;
  color: inherit;
  background: transparent;
  outline: none;
  border: none;
  text-align: end;
  max-width: 50%;

  ${({ flashing }) => flashing && animation}

  span {
    white-space: pre;
  }
`;

export default function Share({ lobbyId }: { lobbyId: string }) {
  const [clicked, setClicked] = useState(false);
  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setClicked(true);

    setTimeout(() => {
      setClicked(false);
    }, FLASH_DURATION);
  };

  return (
    <Bar>
      <Container justify="space-between">
        <LinkContainer>
          u3t.app/game/
          <b>{lobbyId}</b>
        </LinkContainer>
        <CopyToClipboard onClick={handleCopy} flashing={clicked}>
          Copy to{' '}
          <span style={{ whiteSpace: 'pre' }}>
            clipboard
            <FontAwesomeIcon icon={faCopy} />
          </span>
        </CopyToClipboard>
      </Container>
    </Bar>
  );
}
