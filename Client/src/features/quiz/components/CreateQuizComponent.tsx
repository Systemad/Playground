import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Progress,
    Stack,
    useToast,
} from '@chakra-ui/react';
import { ChangeEvent, useContext } from 'react';

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
    { id: 'random', name: 'Random' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
];

export const CreateQuizComponent = () => {
    let content;

    const dispatch = useAppDispatch();
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
            await create({ quizCreationModel: options })
                .unwrap()
                .then((payload) => joinGame(payload));
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
                    <Box
                        rounded={'md'}
                        bg={'cupcake.base200'}
                        boxShadow={'md'}
                        p={8}
                    >
                        <Stack spacing={4}>
                            <Stack align={'center'}>
                                <Heading
                                    textColor={'cupcake.primarycontent'}
                                    fontSize={'4xl'}
                                >
                                    Create Quiz
                                </Heading>
                            </Stack>
                            <Heading
                                textColor={'cupcake.primarycontent'}
                                fontSize={'1xl'}
                            >
                                Name
                            </Heading>
                            <Input
                                bgColor="cupcake.base100"
                                outlineColor={'#dbd4d4'}
                                color={'cupcake.primarycontent'}
                                value={options.name}
                                onChange={handleChange}
                                placeholder="Leave empty for a random name"
                                size="md"
                            />
                            <Heading
                                textColor={'cupcake.primarycontent'}
                                fontSize={'1xl'}
                            >
                                Category
                            </Heading>
                            <SelectionChooser
                                label="category"
                                selections={data?.trivia_categories}
                                onChange={handleCategoryChange}
                            />
                            <Heading
                                textColor={'cupcake.primarycontent'}
                                fontSize={'1xl'}
                            >
                                Difficulty
                            </Heading>
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
