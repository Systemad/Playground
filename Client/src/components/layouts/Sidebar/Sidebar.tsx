import {
    Box,
    BoxProps,
    Button,
    ButtonProps,
    Collapse,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Icon,
    Text,
    useColorMode,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import { AiFillHome } from 'react-icons/ai'
import {
    BsMoonStarsFill,
    BsSun,
    FaUserCircle,
    MdGames,
    MdKeyboardArrowRight,
} from 'react-icons/all'
import { RiFlashlightFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

export const Sidebar = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: gamesIsOpen, onToggle: gamesOnToggle } = useDisclosure()
    const { isOpen: profileIsOpen, onToggle: profileOnToggle } = useDisclosure()

    const navigate = useNavigate()

    const NavItem = ({ ...props }) => {
        // eslint-disable-next-line react/prop-types
        const { icon, children, ...rest } = props
        return (
            <Flex
                align="center"
                px="4"
                mx="2"
                rounded="md"
                py="3"
                cursor="pointer"
                color="whiteAlpha.700"
                _hover={{
                    bg: 'blackAlpha.300',
                    color: 'whiteAlpha.900',
                }}
                role="group"
                fontWeight="semibold"
                transition=".15s ease"
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="2"
                        boxSize="4"
                        _groupHover={{
                            color: 'gray.300',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        )
    }
    const SidebarContent = ({ ...props }: BoxProps) => (
        <Box
            as="nav"
            pos="fixed"
            top="0"
            left="0"
            zIndex="sticky"
            h="full"
            // pb="10"
            overflowX="hidden"
            overflowY="auto"
            bg="#3B4252"
            w="60"
            {...props}
        >
            <VStack
                h="full"
                w="full"
                alignItems="flex-start"
                justify="space-between"
            >
                <Box w="full">
                    <Flex px="4" py="5" align="center">
                        <Icon
                            color="whiteAlpha.900"
                            as={RiFlashlightFill}
                            h={8}
                            w={8}
                        />
                        <Text
                            fontSize="2xl"
                            ml="2"
                            color="whiteAlpha.900"
                            fontWeight="semibold"
                        >
                            Playground
                        </Text>
                    </Flex>
                    <NavItem
                        color="whiteAlpha.900"
                        icon={AiFillHome}
                        onClick={() => navigate('/')}
                    >
                        Home
                    </NavItem>
                    <Flex
                        direction="column"
                        as="nav"
                        fontSize="md"
                        color="gray.600"
                        aria-label="Main Navigation"
                    >
                        <NavItem
                            color="whiteAlpha.900"
                            icon={MdGames}
                            onClick={gamesOnToggle}
                        >
                            Games
                            <Icon as={MdKeyboardArrowRight} ml="auto" />
                        </NavItem>
                        <Collapse in={gamesIsOpen} animateOpacity>
                            <NavItem
                                pl="12"
                                py="2"
                                onClick={() => navigate('/quiz')}
                            >
                                Quiz
                            </NavItem>
                            <NavItem
                                pl="12"
                                py="2"
                                onClick={() => navigate('/guessing')}
                            >
                                Guessing Games
                            </NavItem>
                        </Collapse>

                        <NavItem
                            color="whiteAlpha.900"
                            icon={FaUserCircle}
                            onClick={profileOnToggle}
                        >
                            Profile
                            <Icon as={MdKeyboardArrowRight} ml="auto" />
                        </NavItem>
                        <Collapse in={profileIsOpen} animateOpacity>
                            <NavItem pl="12" py="2">
                                My Profile
                            </NavItem>
                            <NavItem pl="12" py="2">
                                My Settings
                            </NavItem>
                        </Collapse>
                    </Flex>
                </Box>
            </VStack>
        </Box>
    )

    return (
        <>
            <Box bg="#2E3440">
                <SidebarContent display={{ base: 'none', md: 'unset' }} />
                <Drawer isOpen={isOpen} onClose={onClose} placement="left">
                    <DrawerOverlay />
                    <DrawerContent>
                        <SidebarContent w="full" borderRight="none" />
                    </DrawerContent>
                </Drawer>
            </Box>
        </>
    )
}

const NightButton = (props: ButtonProps) => {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Flex justifyContent="center" alignItems="center">
            <Button
                aria-label="Toggle Color Mode"
                onClick={toggleColorMode}
                _focus={{ boxShadow: 'none' }}
                w="fit-content"
                {...props}
            >
                {colorMode === 'light' ? <BsMoonStarsFill /> : <BsSun />}
            </Button>
        </Flex>
    )
}
