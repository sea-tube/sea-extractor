import validator from '@models/validator'
import { ERROR_CODE } from '@controllers/utils/codes'
import ipFromReq from '@controllers/utils/ipFromReq';
import limitReached from '@controllers/utils/limits';
import { v4 as uuidv4 } from 'uuid';
import thumbVideo from '../../../tasks/ffmpeg';
import { mkdir } from 'fs';
import sheetMontage from '../../../tasks/montage';
import { DEFAULT_DIR } from "@config"
import { NFTStorage, File } from "nft.storage";
import { NFT_STORAGE_API_KEY } from "@config"
import path from 'path'
import fs from 'fs'

const client = new NFTStorage({ token: NFT_STORAGE_API_KEY || "" })

async function fileFromPath(filePath: string) {
  const content = await fs.promises.readFile(filePath)
  return new File([content], path.basename(filePath))
}


const storeFileIPFS = (imagePath: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const reader = new FileReader();
      // reader.onload = async (e: any) => {
      //   const blob = new Blob([new Uint8Array(e.target.result)], { type: "image/png" });

      const image = await fileFromPath(imagePath)

      const cid = await client.storeBlob(image)

      resolve(cid)

      // };
      // reader.readAsArrayBuffer(e.target.files[0]);
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

export default async function thumbnails(req: any, res: any) {

  // Check IP limits
  const ip = ipFromReq(req)
  if (limitReached("thumb", ip, 5)) {
    res.status(ERROR_CODE.FORBIDDEN).json(
      {
        status: "FAIL",
        error: "IP limit reached"
      }
    )
  }

  // Try Parse Request JSON
  let json: any = {}
  try {
    json = JSON.parse(req.body)
  } catch (e) {
    return res.status(ERROR_CODE.BAD_REQUEST).json({
      error: "Unable to parse JSON"
    });
  }

  // Validate Request Scheme
  const valid = validator.thumbs(json)
  if (valid !== true) return res.status(ERROR_CODE.BAD_REQUEST).json({ status: "fail", errors: valid.errors })

  const id = uuidv4()

  try {

    await mkdir(`${DEFAULT_DIR}/${id}`, (err) => {
      if (err) {
        throw (err);
      }
      console.log(`Directory ${id} created successfully!`);
    });

    await thumbVideo(id, json.url, .2, true) // 1 thumbs per each 5 second

    await sheetMontage(id, `${DEFAULT_DIR}/${id}/`, `${DEFAULT_DIR}/`)

    const cid = await storeFileIPFS(`${DEFAULT_DIR}/${id}.png`)

    console.log(cid)

    res.status(200).json(
      {
        status: "CREATED",
        image: cid
      })
  } catch (err) {
    res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).json(
      {
        status: "FAIL",
        error: err
      })
  }
}