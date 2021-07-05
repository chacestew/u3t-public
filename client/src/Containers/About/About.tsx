import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

import UnderlineLink from '../../Components/UnderlineLink';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import palette from '../../utils/palette';
import { Article } from '../Rules/index';

const Section = styled.div<{ $dark?: boolean }>`
  padding: 1em;

  ${({ $dark }) => $dark && `background-color: ${palette.primaryDark};`}

  > * + * {
    margin-top: 1em;
  }
`;

const Anchor = styled.a`
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }

  & > span {
    margin-right: 0.25em;
  }
`;

const Button = styled(Anchor).attrs({ as: 'button' })`
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0;
  color: inherit;
  background: transparent;
`;

const CoffeeButton = styled.a`
  display: flex;
  justify-content: center;
`;

const OutboundLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Anchor href={href} target="_blank" rel="noreferrer">
    {children}
  </Anchor>
);

interface Props {
  deferredInstallPrompt: BeforeInstallPromptEvent | null;
}

export default function About({ deferredInstallPrompt }: Props) {
  useDocumentTitle('About');

  return (
    <Article>
      <Section>
        <h3>Features</h3>
        <p>
          <b>u3t.app</b> is a web implementation of ultimate tic-tac-toe, a beautifully
          complex expansion on regular tic-tac-toe. You can find out more about the game
          on its{' '}
          <OutboundLink href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
            <span>Wikipedia page</span>
            <FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
          </OutboundLink>
          .
        </p>
        <p>
          The online multiplayer mode supports reconnection and spectators, and includes a
          turn log to keep track of the game.
        </p>
        <p>
          This site also also meets the requirements for a progressive web application
          (PWA), so you can{' '}
          <Button
            onClick={() => {
              if (deferredInstallPrompt?.prompt) deferredInstallPrompt.prompt();
              else alert('Installing is not currently supported on your device.');
            }}
          >
            <span>install it</span>
            <FontAwesomeIcon size="sm" icon={faDownload} />
          </Button>{' '}
          on your device and continue playing even while offline.
        </p>
      </Section>
      <Section $dark>
        <h3>Open Source</h3>
        <p>
          This application was developed in{' '}
          <OutboundLink href="https://www.typescriptlang.org/">TypeScript</OutboundLink>{' '}
          using <OutboundLink href="https://reactjs.org/">React</OutboundLink> on the
          frontend and <OutboundLink href="https://nodejs.org/en/">Node.js</OutboundLink>{' '}
          and <OutboundLink href="https://socket.io/">Socket.IO</OutboundLink> to power
          the backend.
        </p>
        <p>
          The complete source code is available on{' '}
          <OutboundLink href="https://www.github.com/chacestew/u3t">
            <span>GitHub</span>
            <FontAwesomeIcon icon={faGithub} />
          </OutboundLink>
          .
        </p>
      </Section>
      <Section>
        <h3>Thank you</h3>
        <p>
          If you enjoyed yourself or you have any questions or feedback, please let me
          know via the <UnderlineLink to="/contact">contact form</UnderlineLink>.
        </p>
        <p>
          This application is provided freely for entertainment and education and will
          remain ad-free forever. You can help to keep me and the server chugging through
          coffee donations below.
        </p>
        <CoffeeButton
          href="https://www.buymeacoffee.com/chaceopensource"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png"
            alt="Buy Me A Coffee"
            height="60px"
            width="217px"
          />
        </CoffeeButton>
        <p>Thanks for playing!</p>
        <p>Chace</p>
      </Section>
    </Article>
  );
}
