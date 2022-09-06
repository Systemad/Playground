import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Image,
    SimpleGrid,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

import { GameCard } from './GameCard';

export const RecentGames = () => {
    let hey;

    // SORT GAMES HERE, WINS INTO ONE, LOSSES INTO ONE, AND ALL INTO ONE
    // Just loop all games and compare winner username with my own, if === then win, else loss

    return (
        <Box
            maxW={'900px'}
            w={'full'}
            h={'100vh'}
            maxH={'95vh'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}
        >
            <Tabs defaultIndex={0} size="lg" isFitted isLazy>
                <TabList>
                    <Tab>All</Tab>
                    <Tab>Wins</Tab>
                    <Tab>Loss</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SimpleGrid columns={2} spacing={5}>
                            <GameCard />
                            <GameCard />
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel>
                        <p>Wins</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Losses</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};
