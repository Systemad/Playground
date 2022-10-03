import { useMsal } from '@azure/msal-react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
    Box,
    BoxProps,
    Button,
    CloseButton,
    Collapse,
    Drawer,
    DrawerContent,
    Flex,
    FlexProps,
    Icon,
    Link,
    Text,
    useColorMode,
    useColorModeValue,
    useDisclosure,
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
interface LinkItemProps {
    name: string;
    icon: IconType;
    link?: string;
    collapsable?: boolean;
    isChild?: boolean;
    children?: Array<LinkItemProps>;
}

const LinkItems: Array<LinkItemProps> = [
    {
        name: 'Games',
        icon: MdOutlineGames,
        link: '/games',
        collapsable: true,
        children: [
            {
                name: 'Trivia / Quiz',
                link: '/quiz',
                isChild: true,
                icon: FaRegQuestionCircle,
            },
            {
                name: 'Guessing Games',
                link: '/guess',
                isChild: true,
                icon: FaRegImage,
            },
        ],
    },
];

export const SimpleSidebar = ({ children }: { children: ReactNode }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { instance } = useMsal();

    return (
        <Box minH="100vh" bg="gray.800">
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
            bg="gray.800"
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
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
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Logo
                </Text>
                <CloseButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onClose}
                />
            </Flex>
            <HomeButton />
            {LinkItems.map((link) => (
                <CollapsableItem key={link.name} link={link}>
                    {link.name}
                </CollapsableItem>
            ))}
        </Box>
    );
};

interface CollapsableNavItemProps extends FlexProps {
    link: LinkItemProps;
    children: ReactNode;
}
const CollapsableItem = ({ link, children }: CollapsableNavItemProps) => {
    const { isOpen, onToggle } = useDisclosure();

    if (link.collapsable) {
        return (
            <>
                <Flex
                    direction="column"
                    as="nav"
                    fontSize="md"
                    color="gray.600"
                    aria-label="Main Navigation"
                >
                    <NavItem
                        color="whiteAlpha.900"
                        icon={link.icon}
                        onClick={onToggle}
                        isChild={false}
                    >
                        {children}
                        <Icon as={MdKeyboardArrowRight} ml="auto" />
                    </NavItem>
                    {link.children && (
                        <Collapse in={isOpen} animateOpacity>
                            <Flex direction="column" bg={'gray.700'}>
                                {link.children.map((item) => (
                                    <NavItem
                                        color="whiteAlpha.900"
                                        key={item.name}
                                        isChild={item.isChild}
                                        icon={item.icon}
                                        link={item.link}
                                    >
                                        {item.name}
                                    </NavItem>
                                ))}
                            </Flex>
                        </Collapse>
                    )}
                </Flex>
            </>
        );
    }
    return (
        <>
            <NavItem color="whiteAlpha.900" icon={link.icon} onClick={onToggle}>
                {children}
            </NavItem>
        </>
    );
};

// TODO: https://github.com/chakra-ui/design-vs-dev/blob/main/challenges/afrosonic-concept-dashboard/src/components/sidebar/nav-item.tsx#L8
interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactNode;
    link?: string;
    isChild?: boolean;
}
const NavItem = ({ icon, children, isChild, link, ...rest }: NavItemProps) => {
    if (isChild) {
        return (
            <Link
                as={ReachLink}
                to={link ?? ''}
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}
            >
                <Flex
                    w="full"
                    align="center"
                    p="4"
                    borderRadius="md"
                    role="group"
                    cursor="pointer"
                    _hover={{
                        bg: 'gray.500',
                        color: 'white',
                    }}
                    {...rest}
                >
                    {icon && (
                        <Icon
                            mr="4"
                            fontSize="16"
                            _groupHover={{
                                color: 'white',
                            }}
                            as={icon}
                        />
                    )}
                    {children}
                </Flex>
            </Link>
        );
    }

    return (
        <Flex
            align="center"
            p="4"
            w="full"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
                bg: 'gray.500',
                color: 'white',
            }}
            {...rest}
        >
            {icon && (
                <Icon
                    mr="4"
                    fontSize="16"
                    _groupHover={{
                        color: 'white',
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
        <Flex align="center" p="4" mx="4" borderRadius="lg" role="group">
            <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
        </Flex>
    );
};

const HomeButton = () => {
    return (
        <Link
            as={ReachLink}
            to="/"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
        >
            <Flex
                w="full"
                align="center"
                p="4"
                borderRadius="md"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'gray.500',
                    color: 'white',
                }}
            >
                <Icon
                    mr="4"
                    fontSize="16"
                    _groupHover={{
                        color: 'white',
                    }}
                    as={FiHome}
                />
                Home
            </Flex>
        </Link>
    );
};
