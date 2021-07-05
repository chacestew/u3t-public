import { Board, Cell, Player } from '@u3t/common';
import React, { memo } from 'react';
import styled from 'styled-components';

import { media } from '../../../styles/mixins';
import palette from '../../../utils/palette';
import BoardSVG from '../BoardSVG';
import BaseCell from '../Cell/Cell';

export const TurnListParagraph = styled.p`
  font-weight: normal;
  padding: 0 0.5em;
  margin-top: 0.5em;
  line-height: 2;

  &:last-child {
    margin-bottom: 0.5em;
  }

  > * + * {
    margin-left: 0.5em;
  }

  ${media.aboveTablet`
    > * + * {
     margin-left: 1em;
    }`}
`;

export const TurnListCell = styled(BaseCell).attrs({ forwardedAs: 'span' })`
  width: 1.5em;
  height: 1.5em;
  box-shadow: none;
  cursor: auto;
`;

const StyledBoardSVG = styled(BoardSVG)`
  vertical-align: middle;
`;

const TurnNumber = styled.span`
  display: inline-block;
  min-width: 2.15em;
`;

const TurnListTextMobile = styled.span`
  display: inline-block;

  ${media.aboveMobileL`
    display: none;
  `}
`;

const TurnListTextDesktop = styled.span`
  display: none;

  ${media.aboveMobileL`
    display: inline-block;
  `}
`;

const TurnListBoardIcon = memo(({ index, player }: { index: Cell; player?: Player }) => {
  const getPathAttributes = (i: number) => ({
    fill: index !== i || !player ? 'white' : player === 1 ? palette.red : palette.yellow,
    fillOpacity: i === index ? 1 : 0.5,
  });

  return <StyledBoardSVG size="1.5em" getPathAttributes={getPathAttributes} />;
});

TurnListBoardIcon.displayName = 'TurnListBoardIcon';

const TurnListItem = ({
  turn,
  player,
  board,
  cell,
}: {
  turn: number;
  player: Player;
  board: Board;
  cell: Cell;
}) => (
  <TurnListParagraph>
    <TurnNumber>#{turn + 1}</TurnNumber>
    <TurnListCell cellType={player} />
    <TurnListTextDesktop>
      played on board <b>{board + 1}</b> and chose cell <b>{cell + 1}</b>
    </TurnListTextDesktop>
    <TurnListTextMobile>
      chose board <b>{board + 1}</b> cell <b>{cell + 1}</b>
    </TurnListTextMobile>
    <TurnListBoardIcon index={board} />
    <TurnListBoardIcon index={cell} player={player} />
  </TurnListParagraph>
);

export default TurnListItem;
