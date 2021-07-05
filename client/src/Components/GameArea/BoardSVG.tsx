import { Board } from '@u3t/common';
import * as React from 'react';

const BoardSVG = ({
  size = '1em',
  pathAttributes,
  getPathAttributes,
  className,
  ...rest
}: {
  size?: string;
  getPathAttributes?: (index: Board) => { fill: string; fillOpacity: number };
  pathAttributes?: Array<{ fill: string; fillOpacity: number }>;
  className?: string;
}) => {
  const getAttrs = (index: Board) => {
    if (pathAttributes) return pathAttributes[index];
    if (getPathAttributes) return getPathAttributes(index);
    return {};
  };

  return (
    <svg
      className={`board-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 965.199 965.199"
      {...rest}
    >
      <path
        d="M263.85 30c0-16.6-13.4-30-30-30h-202c-16.6 0-30 13.4-30 30v202.1c0 16.6 13.4 30 30 30h202.1c16.6 0 30-13.4 30-30V30h-.1z"
        {...getAttrs(0)}
      />
      <path
        d="M613.55 30c0-16.6-13.4-30-30-30h-202c-16.6 0-30 13.4-30 30v202.1c0 16.6 13.4 30 30 30h202c16.6 0 30-13.4 30-30V30z"
        {...getAttrs(1)}
      />
      <path
        d="M963.25 30c0-16.6-13.4-30-30-30h-202c-16.601 0-30 13.4-30 30v202.1c0 16.6 13.399 30 30 30h202.1c16.601 0 30-13.4 30-30V30h-.1z"
        {...getAttrs(2)}
      />
      <path
        d="M263.85 381.6c0-16.6-13.4-30-30-30h-202c-16.6 0-30 13.4-30 30v202c0 16.6 13.4 30 30 30h202.1c16.6 0 30-13.4 30-30v-202h-.1z"
        {...getAttrs(3)}
      />
      <path
        d="M613.55 381.6c0-16.6-13.4-30-30-30h-202c-16.6 0-30 13.4-30 30v202c0 16.6 13.4 30 30 30h202c16.6 0 30-13.4 30-30v-202z"
        {...getAttrs(4)}
      />
      <path
        d="M963.25 381.6c0-16.6-13.4-30-30-30h-202c-16.601 0-30 13.4-30 30v202c0 16.6 13.399 30 30 30h202.1c16.601 0 30-13.4 30-30v-202h-.1z"
        {...getAttrs(5)}
      />
      <path
        d="M233.85 703.1h-202c-16.6 0-30 13.4-30 30v202.1c0 16.602 13.4 30 30 30h202.1c16.6 0 30-13.398 30-30V733.1c-.1-16.5-13.5-30-30.1-30z"
        {...getAttrs(6)}
      />
      <path
        d="M583.55 703.1h-202c-16.6 0-30 13.4-30 30v202.1c0 16.602 13.4 30 30 30h202c16.6 0 30-13.398 30-30V733.1c0-16.5-13.401-30-30-30z"
        {...getAttrs(7)}
      />
      <path
        d="M933.25 703.1h-202c-16.601 0-30 13.4-30 30v202.1c0 16.602 13.399 30 30 30h202.1c16.601 0 30-13.398 30-30V733.1c-.1-16.5-13.5-30-30.1-30z"
        {...getAttrs(8)}
      />
    </svg>
  );
};

export default BoardSVG;
