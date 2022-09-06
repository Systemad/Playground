import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

import { ProfilePageCard } from '../components/ProfilePageCard';
import { RecentGames } from '../components/RecentGames';

export const UserPage = () => {
    let hey;

    return (
        <Stack spacing={4} direction="row">
            <ProfilePageCard />
            <RecentGames />
        </Stack>
    );
};
