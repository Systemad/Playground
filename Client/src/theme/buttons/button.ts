import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
    borderRadius: 'md',
    fontSize: 'md',
    fontWeight: 'normal',
    fontFamily: 'mono',
    backgroundColor: 'blue',
});

const textAnswerButton = defineStyle({
    color: 'white',
    h: '100px',
    w: '100%',
    style: {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
    },
    _hover: {
        transform: 'scale(1.03)',
        bg: '#81A1C1',
    },
    //transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',

    // let's also provide dark mode alternatives
    _dark: {
        background: 'orange.300',
        color: 'orange.800',
    },
});

const Button1 = defineStyle({
    // The styles all button have in common
    baseStyle: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderRadius: 'base', // <-- border radius is same for all variants and sizes
    },
    // Two sizes: sm and md
    sizes: {
        sm: {
            fontSize: 'sm',
            px: 4, // <-- px is short for paddingLeft and paddingRight
            py: 3, // <-- py is short for paddingTop and paddingBottom
        },
        md: {
            fontSize: 'md',
            px: 6, // <-- these values are tokens from the design system
            py: 4, // <-- these values are tokens from the design system
        },
    },
    // Two variants: outline and solid
    variants: {
        outline: {
            border: '2px solid',
            borderColor: 'purple.500',
            color: 'purple.500',
        },
        solid: {
            bg: 'purple.500',
            color: 'white',
        },
    },
    // The default size and variant values
    defaultProps: {
        size: 'md',
        variant: 'outline',
    },
});

export const buttonTheme = defineStyleConfig({
    baseStyle,
    variants: { textAnswerButton, Button1 },
});
