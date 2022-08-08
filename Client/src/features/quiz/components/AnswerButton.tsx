import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';

import connection from '../../../utils/api/signalr/Socket';

export type Props = {
  children: React.ReactNode;
  [x:string]: any;
}

export const AnswerButton: React.FC<Props> = (props) => {

  const [color, setColor] = useState('blue.900');
  connection.on("RoundResults", (correct: string) => {
    if(correct === props.children){
      setColor('green.900');
    } else {
      setColor('red.900');
    }
  })

  
  return (
    <Box
      as="button"
      style={{
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      }}
      color={color}
      backgroundColor="#949BFF"
      _hover={{
        background: '#707AFF',
        color: 'gray.200',
      }}
      p="28px"
      lineHeight="1.2"
      borderRadius="md"
      h="24px"
      w={['100%', '50%']}
      display="inline-flex"
      outline="none"
      position="relative"
      verticalAlign="middle"
      justifyContent="center"
      alignItems="center"
      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
      {...props}
    >
      {props.children}
    </Box>
  );
};