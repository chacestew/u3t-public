import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { media } from '../styles/mixins';
import palette, { gridSize } from '../utils/palette';

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  height: 50px;
  background-color: ${palette.primaryDark};
`;

const FooterInner = styled.div`
  max-width: ${gridSize};
  display: flex;
  align-items: stretch;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  color: ${palette.white};
`;

const SocialLinks = styled.div`
  height: 100%;
  display: flex;
  padding-right: 0.5em;

  > * + * {
    margin-left: 0.1em;
  }
`;

const IconLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5em;
`;

const IconAnchor = styled.a`
  display: flex;
  align-items: center;
  padding: 0.5em;
`;

const Button = styled.button`
  cursor: pointer;
  padding: 0 0.5em;
  color: white;
  background-color: transparent;
  outline: none;
  border: none;
  padding: none;
`;

const Text = styled.span`
  display: flex;
  align-items: center;
  padding-left: 1em;

  ${media.aboveMobileL`display: none;`}

  &.desktop {
    display: none;
    ${media.aboveMobileL`display: flex;`}
  }
`;

interface Props {
  deferredInstallPrompt: BeforeInstallPromptEvent | null;
}

const Footer = ({ deferredInstallPrompt }: Props) => {
  return (
    <StyledFooter>
      <FooterInner>
        <Text>© C Stewart {new Date().getFullYear()}</Text>
        <Text className="desktop">© Chace Stewart {new Date().getFullYear()}</Text>
        <SocialLinks>
          <IconLink to="/contact" aria-label="Contact Page">
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </IconLink>
          <IconAnchor href="https://www.github.com/chacestew" aria-label="GitHub Link">
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </IconAnchor>
          <Button
            aria-label="Install Application"
            onClick={() => {
              if (deferredInstallPrompt?.prompt) deferredInstallPrompt.prompt();
              else alert('Installing is not currently supported on your device.');
            }}
          >
            <FontAwesomeIcon icon={faDownload} size="lg" />
          </Button>
        </SocialLinks>
      </FooterInner>
    </StyledFooter>
  );
};

export default Footer;
