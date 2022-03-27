/* API limit control based on IP */

const MAX_PER_MINUTE_DEFAULT = 5
const LIMIT_INTERVAL = 1000 * 60 // 1 minute

const requestsStorage: any = {}

const timestamp = () => Date.now()

export default function limitReached(id: string, ip: string, max_per_minute: number = MAX_PER_MINUTE_DEFAULT) {

  // Ensure controller id is defined
  if (!(id in requestsStorage)) requestsStorage[id] = {}

  // Save IP request with timestamp
  if (!(ip in requestsStorage[id])) requestsStorage[id][ip] = []
  let index = requestsStorage[id][ip].push(timestamp())

  // Auto clean after defined interval
  setInterval(() => {
    requestsStorage[id][ip].splice(index, 1)
    if (requestsStorage[id][ip].length == 0) delete requestsStorage[id][ip]
  }, LIMIT_INTERVAL)

  console.log(requestsStorage)

  // If requests number is greater than limit return true, else false
  return requestsStorage[id][ip].length > max_per_minute ? true : false
}