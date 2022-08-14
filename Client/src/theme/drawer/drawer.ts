import { ComponentStyleConfig, extendTheme } from '@chakra-ui/react';

const Drawer: ComponentStyleConfig = {
  parts: ['dialog', 'header', 'body'],
  variants: {
    permanent: {
      dialog: {
        pointerEvents: 'auto',
        maxW: '200px',
        W: '200px',
      },
      dialogContainer: {
        pointerEvents: 'none',
      },
    },
  },
};

export default Drawer;