import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from '../../../Button';
import { Bar, Cell, Text } from '../styles';

interface PlayAgainProps {
  isOnline?: boolean;
  onPlayAgainConfirm: () => void;
  restartRequested?: boolean;
}

const PlayAgain = ({
  isOnline,
  onPlayAgainConfirm,
  restartRequested,
}: PlayAgainProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const onClick = () => {
    setConfirmed(!confirmed);
    onPlayAgainConfirm();
  };

  return (
    <Text justify="flex-end">
      <Button $shadow $rounded onClick={onClick} disabled={confirmed}>
        Play again? {isOnline && `(${restartRequested || confirmed ? 1 : 0}/2)`}
      </Button>
    </Text>
  );
};

const Span = styled.span`
  margin-left: 0.5em;
`;

interface Props extends PlayAgainProps {
  winner: 1 | 2 | null;
}

const Finished = ({ isOnline, winner, restartRequested, onPlayAgainConfirm }: Props) => {
  return (
    <Bar>
      <Text justify="flex-start">
        {winner ? (
          <>
            <Cell cellType={winner} />
            <Span>wins!</Span>
          </>
        ) : (
          'Stalemate!'
        )}
      </Text>
      <PlayAgain
        restartRequested={restartRequested}
        isOnline={isOnline}
        onPlayAgainConfirm={onPlayAgainConfirm}
      />
    </Bar>
  );
};

export default Finished;
