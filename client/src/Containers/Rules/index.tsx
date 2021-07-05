import React from 'react';
import styled from 'styled-components';

import pic1 from '../../../assets/learn1.png';
import pic2 from '../../../assets/learn2.png';
import pic3 from '../../../assets/learn3.png';
import { TurnListCell } from '../../Components/GameArea/TurnList/TurnListItem';
import UnderlineLink from '../../Components/UnderlineLink';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { media } from '../../styles/mixins';
import palette from '../../utils/palette';

export const Section = styled.div<{ $dark?: boolean }>`
  display: grid;
  grid-template-areas:
    'text'
    'image';
  grid-gap: 1em;
  padding: 1em;

  ${media.aboveMobileL`
    grid-template-areas: 'text image';
    grid-template-columns: 1fr 1fr;
  `}

  ${({ $dark }) => $dark && `background-color: ${palette.primaryDark};`}
`;

const Text = styled.div`
  grid-area: text;

  > * + * {
    margin-top: 1em;
  }
`;

export const Article = styled.article`
  background-color: ${palette.primaryLight};
  color: white;
  line-height: 135%;
`;

const Image = styled.img`
  grid-area: image;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Description = styled.p`
  padding: 1em;
`;

export default function Learn() {
  useDocumentTitle('Learn');

  return (
    <Article>
      <Description>
        Ultimate Tic-Tac-Toe uses all the mechanics of the original game with a few new
        mechanics and 3x3 format. Read on to learn more!
      </Description>
      <Section $dark>
        <Text>
          <h3>Taking Turns</h3>
          <p>
            Every time a player chooses a cell, the other player is sent to the board in
            the same position.
          </p>
          <p>
            Example: <TurnListCell cellType={1} /> has made his first move in the{' '}
            <b>top-right</b> cell of the center board, so <TurnListCell cellType={2} />{' '}
            must choose a cell from the <b>top-right</b> board to play in.
          </p>
        </Text>
        <Image
          src={pic2}
          alt="Player 2 must play in the top-right board because Player 1 chose a top-right cell"
        />
      </Section>
      <Section>
        <Text>
          <h3>Occupied Boards</h3>
          <p>Once a board is either won or tied, it can no longer be played in.</p>
          <p>
            If a player is sent to such a board, they can choose <b>any open board</b> to
            play in.
          </p>
          <p>Be careful! Much of the game's strategy lies in this simple rule.</p>
        </Text>
        <Image
          src={pic3}
          alt="Sending the other player to an occupied boards lets them choose from any open board to play in"
        />
      </Section>
      <Section $dark>
        <Text>
          <h3>Winning</h3>
          <p>
            You win overall when you win <b>three boards in a row</b>.
          </p>
          <p>
            It is much harder to reach a stalemate due to the increased constraints and
            permutations of moves (but still possible!).
          </p>
          <p>
            Have fun!{' '}
            <UnderlineLink to="/" aria-label="Home Page">
              Start playing
            </UnderlineLink>{' '}
            or{' '}
            <UnderlineLink to="/about" aria-label="About Page">
              learn how this app was made
            </UnderlineLink>
            .
          </p>
        </Text>
        <Image src={pic1} alt="Win three boards in a row to win the game" />
      </Section>
    </Article>
  );
}
