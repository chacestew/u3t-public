import { ClientSocket } from '@u3t/common';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { io } from 'socket.io-client';
import styled from 'styled-components';

import ErrorBoundary from '../Components/ErrorBoundary';
import { useTracking } from '../hooks/useTracking';
import GlobalStyle from '../styles/global';
import { media } from '../styles/mixins';
import { gridSize } from '../utils/palette';
import Footer from './Footer';
import Header from './Header';

const Home = lazy(() => import('./Home'));
const Lobby = lazy(() => import('./Lobby'));
const About = lazy(() => import('./About/About'));
const Contact = lazy(() => import('./Contact/contact'));
const HotSeat = lazy(() => import('./HotSeat'));
const PlayAI = lazy(() => import('./PlayAI'));
const Rules = lazy(() => import('./Rules'));

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 auto;
  max-width: ${gridSize};
  width: 100%;

  overflow: hidden;

  ${media.aboveMobileL`overflow: auto`}
`;

const socketURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8001'
    : window.location.protocol + '//' + window.location.host;

const socket: ClientSocket = io(socketURL, { path: '/ws' });

function App() {
  useTracking();
  const [deferredInstallPrompt, setDeferredInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    });
  });

  return (
    <>
      <GlobalStyle />
      <Header />
      <ErrorBoundary>
        <Main>
          <Suspense fallback={null}>
            <Switch>
              <Route exact path="/">
                <Home socket={socket} />
              </Route>
              <Route
                exact
                path="/game/:lobbyId"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                render={(routeProps: any) => <Lobby socket={socket} {...routeProps} />}
              />
              <Route
                exact
                path="/game/:lobbyId/spectate"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                render={(routeProps: any) => (
                  <Lobby socket={socket} spectator {...routeProps} />
                )}
              />
              <Route path="/local" component={HotSeat} />
              <Route path="/ai" component={PlayAI} />
              <Route path="/rules" component={Rules} />
              <Route
                path="/about"
                render={(routeProps) => (
                  <About {...routeProps} deferredInstallPrompt={deferredInstallPrompt} />
                )}
              />
              <Route path="/contact" component={Contact} />
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </Main>
      </ErrorBoundary>
      <Footer deferredInstallPrompt={deferredInstallPrompt} />
    </>
  );
}

export default App;
