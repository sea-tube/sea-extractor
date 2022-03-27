import { exit } from 'process'
import startServer from './server'
import { DEFAULT_DIR } from "./config"
import { mkdir, existsSync } from 'fs';

function checkEnv() {
    return true
}

export default async function init() {
    try {
        const env = checkEnv()
        if (env !== true) {
            console.error("Invalid Env")
            return
        }
        if (!existsSync(DEFAULT_DIR)) {
            await mkdir(DEFAULT_DIR, (err) => {
                if (err) {
                    throw (err);
                }
                console.log(`Directory ${DEFAULT_DIR} created successfully!`);
            });
        }
        startServer()
    } catch (err) {
        console.error("Error init: " + err)
        exit(1)
    }
}