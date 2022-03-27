
import express from "express"
const router = express.Router()

import thumb from "./controllers/api/thumbs"
import notAllowed from "./controllers/api/notAllowed"

// User info [POST]
router.get('/thumbs/', notAllowed)
router.post('/thumbs/', thumb)
router.put('/thumbs/', notAllowed)
router.delete('/thumbs/', notAllowed)

export default router