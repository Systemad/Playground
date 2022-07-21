import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Drawer: {
      variants: {
        parts: ['dialog', 'header', 'body'],
        permanent: {
          dialog: {
            pointerEvents: 'auto',
            maxW: "200px",
            W: "200px",
          },
          dialogContainer: {
            pointerEvents: 'none',
          },
        },
      },
    },
  },
});

export default theme;