import {
  Accordion, AccordionButton, AccordionIcon,
  AccordionItem, AccordionPanel,
  Box,
  BoxProps,
  Button, ButtonProps,
  Divider,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  GridItem,
  Icon,
  Text, useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { AiOutlineHome } from 'react-icons/ai';
import { BsFillMoonFill, BsFillSunFill, BsMoonStarsFill, BsSun } from 'react-icons/all';
import { RiFlashlightFill } from 'react-icons/ri';

import { AccordionButtonDiv } from './AccordionButtonDiv';
import { NavItem } from './NavItem';

export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <GridItem area={'nav'}>
        <Box bg='#2E3440'>
          <SidebarContent display={{ base: 'none', md: 'unset' }} />
          <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
            <DrawerOverlay />
            <DrawerContent>
              <SidebarContent w='full' borderRight='none' />
            </DrawerContent>
          </Drawer>
        </Box>
      </GridItem>
    </>
  );
};

const SidebarContent = ({ ...props }: BoxProps) => (
  <Box
    as='nav'
    pos='fixed'
    top='0'
    left='0'
    zIndex='sticky'
    h='full'
    // pb="10"
    overflowX='hidden'
    overflowY='auto'
    bg={useColorModeValue('#3B4252', '#3B4252')}
    borderColor={useColorModeValue('inherit', 'gray.700')}
    borderRightWidth='1px'
    w='60'
    {...props}
  >
    <VStack h='full' w='full' alignItems='flex-start' justify='space-between'>
      <Box w='full'>
        <Flex px='4' py='5' align='center'>
          <Icon color='whiteAlpha.900' as={RiFlashlightFill} h={8} w={8} />
          <Text
            fontSize='2xl'
            ml='2'
            color='whiteAlpha.900'
            fontWeight='semibold'
          >
            Playground
          </Text>
        </Flex>
        <Flex
          direction='column'
          as='nav'
          fontSize='md'
          color='gray.600'
          aria-label='Main Navigation'
        >
          <Accordion defaultIndex={[0]} allowMultiple>
            <GameSection />
            <ProfileSection />
            <NightButton />
          </Accordion>
        </Flex>
      </Box>
    </VStack>
  </Box>
);

const GameSection = () => {
  return (
    <>
      <AccordionItem borderColor='#2E3440'>
        <h5 color='whiteAlpha.100'>
          <AccordionButton bg='#2E3440'>
            <Box flex='1' textAlign='left'>
              <AccordionButtonDiv route='quiz' icon={AiOutlineHome}>Games</AccordionButtonDiv>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h5>
        <AccordionPanel pb={4} color='whiteAlpha.900'>
          <NavItem icon={AiOutlineHome}>Quiz</NavItem>
        </AccordionPanel>
      </AccordionItem>
    </>
  );
};

const ProfileSection = () => {

  return (
    <>
      <AccordionItem bg='#2E3440' borderColor='#2E3440'>
        <h5 color='white'>
          <AccordionButton bg='#2E3440'>
            <Box flex='1' textAlign='left'>
              <AccordionButtonDiv route='profile' icon={AiOutlineHome}>Profile</AccordionButtonDiv>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h5>
        <AccordionPanel pb={4}>
          <NavItem icon={AiOutlineHome}>Statistics</NavItem>
          <NavItem icon={AiOutlineHome}>Settings</NavItem>
        </AccordionPanel>
      </AccordionItem>
    </>
  );
};

function NightButton(props: ButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent='center' alignItems='center'>
      <Button
        aria-label='Toggle Color Mode'
        onClick={toggleColorMode}
        _focus={{ boxShadow: 'none' }}
        w='fit-content'
        {...props}>
        {colorMode === 'light' ? <BsMoonStarsFill /> : <BsSun />}
      </Button>
    </Flex>
  );
}