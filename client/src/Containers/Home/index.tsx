import { faGlobe, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClientSocket, Events, getInitialState } from '@u3t/common';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Button, ButtonLink } from '../../Components/Button';
import GameView from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import HomeHeader from '../../Components/GameArea/Header/HeaderContents/Home';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { flexColumns, media } from '../../styles/mixins';
import palette from '../../utils/palette';
import CodeInputForm, { CodeInputMode } from './CodeInputForm';

const Article = styled.article`
  ${flexColumns}
  align-items: center;
  justify-content: center;
`;

const MiddleContent = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const Description = styled.p`
  color: ${palette.white};
  line-height: 1.5;
  margin: 1em 0;
  font-size: 16px;
`;

const MenuContainer = styled.div`
  position: absolute;
  padding: 1em;
  background: rgba(89, 75, 92);
  width: 100%;
  min-height: 100%;
  border-radius: 4px;

  color: white;
  top: 0;
  ${flexColumns}
  justify-content: space-around;
  justify-content: space-evenly;

  ${media.aboveMobileL`
  display: block;
            padding: 2em;
            min-height: unset;
height: 90%;
width: 90%;
top: unset;
            border-radius: 6px;`}
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'start join spectate'
    'join-code join-code join-code';
  grid-gap: 1em;

  ${media.aboveMobileL`
  grid-template-areas:
    'start join spectate'
    'join-code join-code join-code';
  `}
`;

const MultiMenuItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;
`;

const MenuHeader = styled.h3`
  & > svg {
    margin-right: 0.5em;
  }
`;

const MenuSection = styled.section<{ marginBottom?: boolean }>`
  &:first-child {
    ${media.aboveMobileL`
  margin-bottom: 3em;
  `}
    margin-bottom: 1em;
  }
`;

export default function Home({ socket }: { socket: ClientSocket }) {
  const [codeInputMode, setCodeInputMode] = useState<CodeInputMode>(null);
  const history = useHistory();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isRequestingLobby, setIsRequestingLobby] = useState(false);
  useDocumentTitle('');

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => setIsConnected(false));

    if (socket.disconnected) socket.connect();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  useEffect(() => {
    if (!isRequestingLobby) return;

    const timer = setTimeout(() => {
      socket.sendBuffer = [];
      setIsRequestingLobby(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isRequestingLobby, socket]);

  const onCreateGame = () => {
    socket.emit(Events.CreateLobby, (data) => {
      history.push(`/game/${data.lobbyId}`, data);
    });
    setIsRequestingLobby(true);
  };

  const onSubmit = (lobbyId: string) => {
    socket.emit(
      Events.JoinLobby,
      {
        lobbyId,
        spectator: codeInputMode === 'spectate',
      },
      (data) => {
        console.log('data inside onSubmit', data);
        history.push(`/game/${data.lobbyId}`, data);
      }
    );
  };

  return (
    <Article>
      <HomeHeader />
      <MiddleContent>
        <GameView state={getInitialState()} />
        <MenuContainer>
          <MenuSection marginBottom>
            <MenuHeader>
              <FontAwesomeIcon icon={faGlobe} />
              Play online
            </MenuHeader>
            <Description>
              Start a new online game or join an existing game to play or spectate.
            </Description>
            <ButtonGrid>
              <Button
                style={{ gridArea: 'start' }}
                onClick={onCreateGame}
                $rounded
                $shadow
                disabled={isRequestingLobby}
              >
                Start
              </Button>
              <Button
                style={{ gridArea: 'join' }}
                onClick={() => setCodeInputMode('join')}
                $rounded
                $shadow
                disabled={isRequestingLobby}
              >
                Join
              </Button>
              <Button
                style={{ gridArea: 'spectate' }}
                onClick={() => setCodeInputMode('spectate')}
                $rounded
                $shadow
                disabled={isRequestingLobby}
              >
                Spectate
              </Button>
              {codeInputMode && (
                <CodeInputForm
                  disabled={isRequestingLobby}
                  onInputSubmit={onSubmit}
                  mode={codeInputMode}
                />
              )}
            </ButtonGrid>
          </MenuSection>

          <MenuSection>
            <MenuHeader>
              <FontAwesomeIcon icon={faUserFriends} />
              Play on device
            </MenuHeader>
            <Description>
              Start a multiplayer game on your device or play against an AI opponent.
            </Description>
            <MultiMenuItem>
              <ButtonLink disabled={isRequestingLobby} to="/local" $rounded $shadow>
                Hotseat
              </ButtonLink>
              <ButtonLink disabled={isRequestingLobby} to="/ai" $rounded $shadow>
                Play AI
              </ButtonLink>
            </MultiMenuItem>
          </MenuSection>
        </MenuContainer>
      </MiddleContent>
    </Article>
  );
}
