import { useMsal } from '@azure/msal-react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
    Box,
    BoxProps,
    Button,
    CloseButton,
    Collapse,
    Divider,
    Drawer,
    DrawerContent,
    Flex,
    FlexProps,
    Icon,
    IconButton,
    Link,
    StackDivider,
    Text,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { IconType } from 'react-icons';
import {
    BsMoonStarsFill,
    BsSun,
    FaRegImage,
    FaRegQuestionCircle,
    MdKeyboardArrowRight,
    MdOutlineGames,
} from 'react-icons/all';
import { FiHome, FiMenu } from 'react-icons/fi';
import { Link as ReachLink } from 'react-router-dom';

// TODO: https://reactrouter.com/en/main/hooks/use-match, to highlight active tab / item

interface NavigationChildItem {
    name: string;
    icon: IconType;
    link?: string;
}

interface NavigationItem {
    name: string;
    icon: IconType;
    children: Array<NavigationChildItem>;
}

const LinkItems: Array<NavigationItem> = [
    {
        name: 'Games',
        icon: MdOutlineGames,
        children: [
            {
                name: 'Trivia / Quiz',
                link: '/quiz',
                icon: FaRegQuestionCircle,
            },
            {
                name: 'Guessing Games',
                link: '/guess',
                icon: FaRegImage,
            },
        ],
    },
    {
        name: 'Acount',
        icon: MdOutlineGames,
        children: [
            {
                name: 'Profile',
                link: '/quiz',
                icon: FaRegQuestionCircle,
            },
            {
                name: 'Settings',
                link: '/guess',
                icon: FaRegImage,
            },
        ],
    },
];

export const SimpleSidebar = ({ children }: { children: ReactNode }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { instance } = useMsal();

    return (
        <Box overflow="hidden" h="100vh" bg="cupcake.base100">
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
};

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            bg="cupcake.base200"
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex
                h="20"
                alignItems="center"
                mx="8"
                justifyContent="space-between"
            >
                <Text
                    color="cupcake.primarycontent"
                    fontSize="3xl"
                    fontFamily="monospace"
                    fontWeight="bold"
                >
                    Playground
                </Text>
                <CloseButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onClose}
                />
            </Flex>
            <HomeButton />
            <VStack spacing={2} align="stretch">
                {LinkItems.map((link) => (
                    <NavSection
                        key={link.name}
                        icon={link.icon}
                        items={link.children}
                    >
                        {link.name}
                    </NavSection>
                ))}
            </VStack>
        </Box>
    );
};

/*

*/
interface NavSectionProps extends FlexProps {
    items: Array<NavigationChildItem>;
    icon: IconType;
    children: ReactNode;
}
const NavSection = ({ items, icon, children }: NavSectionProps) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <>
            <Divider borderColor="#dbd4d4" />
            <Flex
                direction="column"
                as="nav"
                fontSize="md"
                aria-label="Main Navigation"
            >
                <NavItem
                    color="cupcake.primarycontent"
                    icon={icon}
                    onClick={onToggle}
                >
                    {children}
                </NavItem>
                <Flex direction="column">
                    {items.map((item) => (
                        <NavItem key={item.name} icon={item.icon}>
                            {item.name}
                        </NavItem>
                    ))}
                </Flex>
            </Flex>
        </>
    );
};

// TODO: https://github.com/chakra-ui/design-vs-dev/blob/main/challenges/afrosonic-concept-dashboard/src/components/sidebar/nav-item.tsx#L8
interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactNode;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Flex
            align="center"
            p="4"
            color="cupcake.primarycontent"
            role="group"
            cursor="pointer"
            borderRadius={'xl'}
            _hover={{
                bg: 'cupcake.altbase200',
                color: 'black',
            }}
            {...rest}
        >
            {icon && (
                <Icon
                    mr="4"
                    fontSize="16"
                    _groupHover={{
                        color: 'black',
                    }}
                    as={icon}
                />
            )}
            {children}
        </Flex>
    );
};

const ThemeSwitcher = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Flex align="center" p="4" mx="4" role="group">
            <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
        </Flex>
    );
};

const HomeButton = () => {
    const click = () => {
        window.location.reload();
    };
    return (
        <Link
            as={ReachLink}
            to="/"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
        >
            <NavItem key={'home'} icon={FiHome}>
                Home
            </NavItem>
        </Link>
    );
};
