import * as dotenv from 'dotenv';
dotenv.config()

export const DEFAULT_DIR : string = process.env.DEFAULT_DIR || "/tmp/extractor-data"

export const NFT_STORAGE_API_KEY : string = process.env.NFT_STORAGE_API_KEY || ""
