import { Flex, Icon, IconButton,useColorModeValue } from '@chakra-ui/react';
import { MouseEventHandler, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  icon: any,
  children: ReactNode,
  route: string,
}
export const AccordionButtonDiv = ({icon, children, route} : Props) => {
  const color = useColorModeValue('gray.600', 'gray.300');
  const navigate = useNavigate();
  return (
    <Flex
      align="center"
      px="4"
      py="3"
      cursor="pointer"
      role="group"
      fontWeight="bold"
      transition=".15s ease"
      color="whiteAlpha.900"
    >
        <IconButton
          aria-label={route}
          onClick={() => navigate(`/${route}`)}
          mx="2"
          boxSize="4"
        />
      {children}
    </Flex>
  );
};