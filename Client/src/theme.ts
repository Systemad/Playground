import { extendTheme, ThemeConfig } from '@chakra-ui/react';

import { buttonTheme } from './theme/buttons/button';

const config: ThemeConfig = {
    initialColorMode: 'light',
};

const colors = {
    cupcake: {
        primary: '#65c3c8',
        secondary: '#ef9fbc',
        accent: '#eeaf3a',
        neutral: '#291334',
        base100: '#faf7f5',
        base200: '#efeae6',
        base300: '#e7e2df',
        altbase200: '#dbd4d4',
        primarycontent: '#291334',
        success: '#36d399',
        error: '#f87272',
        info: '#3abff8',
    },
};

const theme = extendTheme({
    config,
    colors,
    components: {
        Button: buttonTheme,
    },
});
export default theme;
