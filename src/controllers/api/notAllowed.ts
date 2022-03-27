import { ERROR_CODE } from "@controllers/utils/codes";

export default function notAllowed (req : any, res : any) {
    res.status(ERROR_CODE.BAD_REQUEST).json({
      status: "FAIL",
      error: "invalid request"
    })
  }