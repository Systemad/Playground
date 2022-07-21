import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Theme from "./theme"

ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider theme={Theme} >
        <App />
      </ChakraProvider>
    </React.StrictMode>,
  document.getElementById('root'),
);
