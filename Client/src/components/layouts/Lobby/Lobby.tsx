import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer, DrawerBody, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerHeader,
  Flex,
  FlexProps, FormLabel, GridItem,
  Icon,
  IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon,
  Link, Select, Stack,
  Text, Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { LobbyCard } from '../../../features/lobby';

// <LobbyCard title="Game1" gameMode="quiz" gameStatus="inprogress" players="1/4" />

export const LobbyLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <GridItem bg='papayawhip' area={'main'}>
        <Flex
          bg="#edf3f8"
          _dark={{
            bg: "#3e3e3e",
          }}
          p={5}
          w="full"
          h="full"
          alignItems="center"
          justifyContent="center"
        >
          <Stack spacing={8} direction={['column', 'row']}>
            <LobbyCard title="Game1" gameMode="quiz" gameStatus="inprogress" players="1/4" />
            <LobbyCard title="Game1" gameMode="quiz" gameStatus="inprogress" players="1/4" difficulty="hard" />
          </Stack>
        </Flex>
      </GridItem>
    </>
  )
}