import { Box, Button, ButtonGroup } from '@chakra-ui/react';
import React, { useState } from 'react';

import connection from '../../utils/api/signalr/Socket';

export type Props = {
  children: React.ReactNode;
  choice: string,
  [x: string]: any;
}

export const AnswerButton: React.FC<Props> = (props) => {

  const [color, setColor] = useState('#5E81AC');

  connection.on('RoundResults', (correct: string) => {
    if (props.choice == correct) {
      setColor('#8FBCBB');
    } else {
      setColor('#BF616A');
    }
  });

  connection.on('NextRound', () => {
    setColor('#5E81AC');
  });

  return (
    <Button
      as='button'
      style={{
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      }}
      color='white'
      backgroundColor={color}
      _hover={{
        background: '#81A1C1',
      }}
      p='28px'
      lineHeight='1.2'
      borderRadius='md'
      h='24px'
      w={['100%', '50%']}
      display='inline-flex'
      outline='none'
      position='relative'
      verticalAlign='middle'
      justifyContent='center'
      alignItems='center'
      transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
      {...props}
    >
      {props.children}
    </Button>
  );
};