import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IGameState, Player } from '@u3t/common';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { IMultiplayerState } from '../../../hooks/useLobbyReducer';
import { flexColumns } from '../../../styles/mixins';
import { Button } from '../../Button';
import TurnListItem, { TurnListCell, TurnListParagraph } from './TurnListItem';

const TurnListButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TurnListToggle = styled(Button)`
  color: white;
  background-color: #594b5c;
  z-index: 1;

  :hover,
  :focus {
    filter: none;
    outline: 0;
  }

  & > svg {
    margin-left: 0.5em;
  }
`;

const TurnListContainer = styled.div<{ expanded: boolean }>`
  background-color: #594b5c;
  flex-direction: column;
  flex: 1;
  width: 100%;
  overflow: auto;
  color: white;
  display: none;
  ${({ expanded }) => expanded && `display: flex;`}
`;

const OuterContainer = styled.div<{ $requiresOverlay: boolean }>`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  overflow: hidden;

  ${({ $requiresOverlay }) => $requiresOverlay && `overflow: initial;`}
`;

const StyledTurnList = styled.div<{ expanded: boolean; $requiresOverlay: boolean }>`
  ${flexColumns}
  flex: 1;
  flex-direction: column-reverse;
  overflow: hidden;
  font-weight: bold;
  font-size: 16px;
  color: #594b5c;
  z-index: 1;

  ${({ expanded, $requiresOverlay }) =>
    expanded &&
    `height: 100%; 
     flex-direction: column;
     position: relative;
     width: 100%;
     
     ${
       $requiresOverlay
         ? `opacity: 0.9;
        position: absolute;
        height: calc(100vh - 172px);
        top: 0;`
         : ''
     }
     `}

  ${({ $requiresOverlay }) =>
    false &&
    !$requiresOverlay &&
    `position: relative;
     padding-top: 0;
     opacity: 1;
     bottom: 0;`}
`;

const OpeningText = ({ lobbyState }: { lobbyState: Partial<IMultiplayerState> }) => {
  if (!lobbyState.started) return <span>Waiting for opponent to join.</span>;
  if (lobbyState.isSpectator) return <span>You are spectating.</span>;
  if (lobbyState.playerSeat)
    return (
      <span>
        You are playing as <TurnListCell cellType={lobbyState.playerSeat} /> . Have fun!
      </span>
    );
  return <span>New game started.</span>;
};

const isOverlayRequired = (el: HTMLDivElement | null) => !!(el && el?.offsetHeight < 200);

const TurnList = ({
  state,
  lobbyState,
  RestartButton,
}: {
  state: IGameState;
  seat?: Player;
  RestartButton: JSX.Element;
  lobbyState: Partial<IMultiplayerState>;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [requiresOverlay, setRequiresOverlay] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleResize = () => {
    setRequiresOverlay(isOverlayRequired(containerRef.current));
  };

  useEffect(() => {
    // Initial check after mount
    if (isOverlayRequired(containerRef.current)) {
      setRequiresOverlay(true);
      setExpanded(false);
    }
    // Add listener incase of screen resize
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    <OuterContainer ref={containerRef} $requiresOverlay={requiresOverlay}>
      <StyledTurnList expanded={expanded} $requiresOverlay={requiresOverlay}>
        <TurnListButtonsContainer className="log-header">
          <TurnListToggle onClick={() => setExpanded((ex) => !ex)}>
            Turn log
            <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretUp} />
          </TurnListToggle>
          {RestartButton}
        </TurnListButtonsContainer>
        <TurnListContainer expanded={expanded}>
          <TurnListParagraph>
            <OpeningText lobbyState={lobbyState} />
          </TurnListParagraph>
          {[...state.turnList].reverse().map((t, i, arr) => (
            <TurnListItem key={i} turn={arr.length - 1 - i} {...t} />
          ))}
          {state.finished && (
            <TurnListParagraph>
              {state.tied ? (
                <b>It&apos;s a draw!</b>
              ) : (
                <b>
                  <TurnListCell cellType={state.winner} /> wins!
                </b>
              )}
            </TurnListParagraph>
          )}
        </TurnListContainer>
      </StyledTurnList>
    </OuterContainer>
  );
};

export default TurnList;
