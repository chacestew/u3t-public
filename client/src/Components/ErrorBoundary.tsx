import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import { Main } from '../Containers/App';
import client from '../micro-sentry';
import palette from '../utils/palette';
import { Button } from './Button';

const Section = styled.section`
  padding: 1em;
  background-color: ${palette.primaryLight};
  color: white;

  > * + * {
    margin-top: 1em;
  }
`;

const Buttons = styled.div`
  display: flex;

  > * + * {
    margin-left: 1em;
  }
`;

function ErrorFallback({ error }: { error: Error }) {
  return (
    <Main>
      <Section>
        <h3>Something went wrong</h3>
        {process.env.NODE_ENV === 'development' && <pre>{error.message}</pre>}
        <p>The error has been recorded and sent to me.</p>
        <p>Please try one of the links below to continue.</p>
        <Buttons>
          <Button $rounded $shadow onClick={() => window.location.reload()}>
            Reload Current Page
          </Button>
          <Button $rounded $shadow onClick={() => (window.location.pathname = '/')}>
            Back to Home
          </Button>
        </Buttons>
      </Section>
    </Main>
  );
}

interface Props {
  children: React.ReactNode;
}

export default function ErrorBoundary(props: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => client.report(error)}
      {...props}
    />
  );
}
