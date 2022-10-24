import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Progress,
    Stack,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { ChangeEvent, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { SelectionChooser } from '../../../components/common/SelectionChooser';
import { useAppDispatch, useAppSelector } from '../../../providers/store';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { useGetCategoriesQuery } from '../api/CategoryAPI';
import { useQuizCreateGameMutation } from '../api/quizAPI';
import {
    selectQuizOptions,
    setCategory,
    setDifficulty,
    setName,
} from '../utils/quizOptionSlice';

export interface DifficultyLevel {
    id: string;
    name: string;
}

const difficulties: DifficultyLevel[] = [
    { id: 'any', name: 'Any' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
];

export const CreateQuizComponent = () => {
    let content;

    const bgColor = useColorModeValue('white', 'gray.800');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const toast = useToast();
    const options = useAppSelector(selectQuizOptions);
    const [create, result] = useQuizCreateGameMutation();
    const socket = useContext(socketctx);
    const { data, isLoading, isSuccess, isError, error } =
        useGetCategoriesQuery();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        //setValue(event.currentTarget.value);
        dispatch(setName(event.currentTarget.value));
    };

    const handleCategoryChange = ({
        target: { value },
    }: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCategory(value));
    };
    const handleDifficultyChange = ({
        target: { value },
    }: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setDifficulty(value));
    };

    const joinGame = (id?: string) => {
        if (id) socket?.invoke('join-game', id);
    };
    const handleCreateQuiz = async () => {
        try {
            console.log('creating game');
            await create({ quizCreationModel: options })
                .unwrap()
                .then((payload) => joinGame(payload));
            //.then(() => navigate('/quiz'));
        } catch {
            toast({
                title: 'An error occurred',
                description: "We couldn't create your quiz, try again!",
                status: 'error',
                duration: 2500,
                isClosable: true,
            });
        }
    };

    if (isLoading) {
        content = <Progress size="xl" isIndeterminate />;
    } else if (isSuccess) {
        content = (
            <>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={8}>
                        <Stack spacing={4}>
                            <Stack align={'center'}>
                                <Heading fontSize={'4xl'}>Create Quiz</Heading>
                            </Stack>
                            <Heading fontSize={'1xl'}>Name</Heading>
                            <Input
                                value={options.name}
                                onChange={handleChange}
                                placeholder="Leave empty for a random name"
                                size="md"
                            />
                            <Heading fontSize={'1xl'}>Category</Heading>
                            <SelectionChooser
                                label="category"
                                selections={data?.trivia_categories}
                                onChange={handleCategoryChange}
                            />
                            <Heading fontSize={'1xl'}>Difficulty</Heading>
                            <SelectionChooser
                                label="difficulty"
                                selections={difficulties}
                                onChange={handleDifficultyChange}
                            />
                            <Stack spacing={10}>
                                <Button
                                    onClick={handleCreateQuiz}
                                    bg={'purple.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'purple.500',
                                    }}
                                >
                                    Create Quiz
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </>
        );
    } else if (isError) {
        const errMsg = 'error' in error ? error.error : JSON.stringify(error);
        content = (
            <Heading as="h1" color="gray.50" textAlign="center">
                {errMsg}
            </Heading>
        );
    }

    return (
        <>
            <Flex align={'center'} justify={'center'}>
                {content}
            </Flex>
        </>
    );
};
