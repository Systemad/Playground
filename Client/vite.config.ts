import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import * as path from 'path';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ''
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv
    .map((arg) => arg.match(/--name=(?<value>.+)/i))
    .filter(Boolean)[0];
const certificateName = certificateArg
    ? certificateArg?.groups?.value
    : process.env.npm_package_name;

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        },
    },
    plugins: [
        react(),
        EnvironmentPlugin({
            // Uses 'development' if the NODE_ENV environment variable is not defined.
            NODE_ENV: 'development',

            // Have in mind that variables coming from process.env are always strings.
            DEBUG: 'false',

            // Required: will fail if the API_KEY environment variable is not provided.
            HUB_CONNECTION_URL: 'https://localhost:7069/hubs/quiz',
        }),
        //EnvironmentPlugin(['HUB_CONNECTION_URL', 'development']),
    ],
});
