import {
  Box,
  BoxProps,
  Button,
  chakra,
  CloseButton,
  Drawer, DrawerBody, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerHeader,
  Flex,
  FlexProps, FormLabel, GridItem,
  Heading,
  Icon,
  IconButton,   Image,
Input, InputGroup, InputLeftAddon, InputRightAddon,
  Link, Select, Stack,
  Text, Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { GameStatusButton } from './GameStatusButton';

type Props = {
  title: string,
  gameMode: string,
  players: string,
  gameStatus: string,
  difficulty?: string,
}
export const LobbyCard = ({title, gameMode, players, gameStatus, difficulty} : Props) => {

  return (
    <>
            <Box
              mx="auto"
              px={8}
              py={4}
              rounded="lg"
              shadow="lg"
              bg="white"
              _dark={{
                bg: "gray.800",
              }}
              maxW="xl"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <chakra.span
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                >
                  Date created
                </chakra.span>
                <Flex>
                  { difficulty &&
                    <>
                      <Box
                        px={3}
                        py={1}
                        bg="gray.600"
                        color="gray.100"
                        fontSize="sm"
                        fontWeight="700"
                        rounded="md"
                      >
                        {difficulty}
                      </Box>
                  </>
                  }

                  <Box
                    px={3}
                    py={1}
                    bg="gray.600"
                    color="gray.100"
                    fontSize="sm"
                    fontWeight="700"
                    rounded="md"
                  >
                    {gameMode}
                  </Box>
                </Flex>
              </Flex>

              <Box mt={2}>
                <Box
                  fontSize="2xl"
                  color="gray.700"
                  _dark={{
                    color: "white",
                  }}
                  fontWeight="700">
                  Accessibility tools for designers and developers
                </Box>
              </Box>

              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <GameStatusButton gameStatus={gameStatus} players={players} />

                <Flex alignItems="center">
                  <Box
                    color="gray.700"
                    _dark={{
                      color: "gray.200",
                    }}
                    fontWeight="700"
                  >
                    <Button colorScheme='teal' size='md'>
                      Join
                    </Button>
                  </Box>
                </Flex>
              </Flex>
            </Box>
    </>
  )
}