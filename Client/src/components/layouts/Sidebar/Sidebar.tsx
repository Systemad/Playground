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

export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <GridItem area={'nav'}>
        <Drawer
          variant="permanent"
          isOpen={true}
          placement='left'
          onClose={onClose}
        >
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>
              PLAYGROUND
            </DrawerHeader>

            <DrawerBody p={0}>
              <Stack spacing='24px'>
                <Box>
                  <Button colorScheme='teal' size='md'>
                    Button
                  </Button>
                </Box>

                <Box>
                  <Button colorScheme='teal' size='md'>
                    Button
                  </Button>
                </Box>

                <Box>
                  <Button colorScheme='teal' size='md'>
                    Button
                  </Button>
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth='1px'>
              <Button colorScheme='teal' size='md'>
                Button
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </GridItem>
    </>
  )
}