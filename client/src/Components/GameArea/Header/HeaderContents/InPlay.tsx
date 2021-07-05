import { Cell as CellType, IBoardState } from '@u3t/common';
import React from 'react';

import MiniBoard from '../MiniBoard';
import { Bar, Cell, Text } from '../styles';

interface Props {
  cell: 1 | 2;
  text?: string;
  boards: IBoardState[];
  activeBoard: CellType[];
}

const InPlay = ({ cell, text, boards, activeBoard }: Props) => {
  return (
    <Bar>
      <Text justify="flex-start">
        <Cell cellType={cell} />
      </Text>
      {text && <Text justify="center">{text}</Text>}
      <Text justify="flex-end">
        <MiniBoard boards={boards} activeBoard={activeBoard} />
      </Text>
    </Bar>
  );
};

export default InPlay;
