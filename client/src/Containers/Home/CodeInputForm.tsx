import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from '../../Components/Button';
import palette from '../../utils/palette';

export type CodeInputMode = null | 'join' | 'spectate';

const Container = styled.div`
  grid-area: join-code;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25em;
`;

const Form = styled.form`
  display: flex;

  & > input {
    width: 0;
    flex: 1;
    align-self: stretch;
    margin-right: 1em;
    color: ${palette.primaryDark};
    padding: 0 0.5em;
  }
`;

export default function CodeInputForm({
  disabled,
  mode,
  onInputSubmit,
}: {
  disabled: boolean;
  onInputSubmit: (value: string) => void;
  mode: CodeInputMode;
}) {
  const [code, setCode] = useState('');

  const setText = (value: string) => {
    const text = value.toUpperCase().trim();
    setCode(text);
  };

  return (
    <Container>
      <Label>Input game code to {mode}</Label>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onInputSubmit(code);
        }}
      >
        <input
          disabled={disabled}
          maxLength={4}
          value={code}
          placeholder="CODE"
          onChange={(e) => setText(e.target.value)}
          onPaste={(e) => {
            setText(e.clipboardData.getData('text').trim().slice(-4));
          }}
        />
        <Button type="submit" $rounded $shadow disabled={disabled || code.length !== 4}>
          <FontAwesomeIcon icon={faCheck} />
        </Button>
      </Form>
    </Container>
  );
}
