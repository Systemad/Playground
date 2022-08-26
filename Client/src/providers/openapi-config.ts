import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
    schemaFile: 'swagger.json',
    apiFile: '../providers/emptyApi.ts',
    apiImport: 'emptySplitApi',
    outputFiles: {
        '../features/lobby/api/lobbyAPI.ts': {
            filterEndpoints: [/lobby/i],
            exportName: 'lobbySplitApi',
        },
        '../features/quiz/api/quizAPI.ts': {
            filterEndpoints: [/quiz/i],
            exportName: 'quizSplitApi',
        },
    },
    hooks: true,
}

export default config
