/*
    The mechanism used to get the real IP from the client may vary depending on your server and your needs.
    Getting just req.ip can for example return your server's network address instead of the client/user address.
    Be sure to choose the best method and adjust the function below according to your needs.
    Read more: https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
*/

import { Request } from "express"

// This is an example when the request has to go through multiple proxies.
// X-Forwarded-For: 103.0.113.165, 60.91.3.17, 120.192.338.678
export function removeProxy(req_ip: string | string[]) : string {
    const ip_list = req_ip.toString().split(", ")
    return ip_list[ip_list.length - 1]
}

// The following method works with Heroku
export default function ipFromReq(req: Request): string {
    return removeProxy(req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip)
}