import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'system',
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
        success: '#f87272',
        error: '#36d399',
    },
};

const theme = extendTheme({ config, colors });
export default theme;
