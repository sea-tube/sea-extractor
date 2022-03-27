import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import routesAPI from './routes'

const defaultPort : any = process.env.PORT

const http_port = defaultPort || '3001'

export default function startServer () : any {

  const app = express()

  app.use(cors())

  // Automatically converts request to JSON
  // POST limit size = 4 kbytes
  app.use(bodyParser.text({ inflate: true, limit: '2kb', type: '*/*' }))

  // All API routes are served as version subpath (v1)
  app.use("/v1/", routesAPI)

  // The 404 Route (ALWAYS Keep this as the last route)
  app.use(function(req, res, next) {    
    // respond with json
    if (req.accepts("json")) return res.status(404).json({ errors: ["requested url does not exist"] });
  });

  app.listen(http_port, '0.0.0.0', () => {
    console.info(`Server listening at: http://0.0.0.0:${http_port}`)
  })
}