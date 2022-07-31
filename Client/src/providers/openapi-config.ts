import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: 'swagger.json',
  apiFile: 'emptyApi.ts',
  apiImport: 'emptySplitApi',
  outputFiles: {
    '../features/lobby/lobbyAPI.ts': {
      filterEndpoints: [/lobby/i],
      exportName: 'lobbySplitApi'
    },
    '../features/quiz/quizAPI.ts': {
      filterEndpoints: [/quiz/i],
      exportName: 'quizSplitApi'
    },
  },
  hooks: true,
}

export default config