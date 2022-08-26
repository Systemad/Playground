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
} from '@chakra-ui/react'
import React, { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { SelectionChooser } from '../../../components/common/SelectionChooser'
import { generateRandomNumber } from '../../../utils/randomNumber'
import { useGetCategoriesQuery } from '../api/CategoryAPI'
import { QuizSettingsModel, useQuizCreateGameMutation } from '../api/quizAPI'

export interface DifficultyLevel {
    id: string
    name: string
}

export const CreateQuizLayout = () => {
    let content

    const bgColor = useColorModeValue('white', 'gray.700')

    const settings: QuizSettingsModel = {
        name: `Quiz #${generateRandomNumber()}`,
        questions: 10,
        category: '',
        difficulty: 'Easy',
    }

    const [value, setValue] = React.useState('')

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        settings.name = value
    }

    const navigate = useNavigate()
    const toast = useToast()
    const [create, result] = useQuizCreateGameMutation()

    const difficulties: DifficultyLevel[] = [
        { id: 'easy', name: 'Easy' },
        { id: 'medium', name: 'Medium' },
        { id: 'hard', name: 'Hard' },
    ]

    const { data, isLoading, isSuccess, isError, error } =
        useGetCategoriesQuery()

    const handleCategoryChange = ({
        target: { value },
    }: ChangeEvent<HTMLSelectElement>) => (settings.category = value)
    const handleDifficultyChange = ({
        target: { value },
    }: ChangeEvent<HTMLSelectElement>) => (settings.difficulty = value)

    const handleCreateQuiz = async () => {
        try {
            await create({ quizSettingsModel: settings }).unwrap()
            if (result.status) navigate(`quiz/${result}`)
        } catch {
            toast({
                title: 'An error occurred',
                description: "We couldn't create your quiz, try again!",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    if (isLoading) {
        content = <Progress size="xl" isIndeterminate />
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
                                value={value}
                                onChange={handleChange}
                                placeholder="Enter name for quiz"
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
        )
    } else if (isError) {
        const errMsg = 'error' in error ? error.error : JSON.stringify(error)
        content = (
            <Heading as="h1" color="gray.50" textAlign="center">
                {errMsg}
            </Heading>
        )
    }

    return (
        <>
            <Flex align={'center'} justify={'center'}>
                {content}
            </Flex>
        </>
    )
}
