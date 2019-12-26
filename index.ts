import { RequestListener, IncomingMessage, ServerResponse } from 'http'
import { Headers, Request, Response } from 'node-fetch'

type Handler = (request: Request) => Promise<Response>

function getRequest(req: IncomingMessage) {
  const headers = new Headers()

  for (const [name, values] of Object.entries(req.headers)) {
    if (typeof values === 'string') {
      headers.append(name, values)
    } else if (Array.isArray(values)) {
      for (const value of values) {
        headers.append(name, value)
      }
    }
  }

  return new Request(req.url as string, {
    method: req.method,
    headers,
    body: req
  })
}

function applyResponse(response: Response, res: ServerResponse) {
  res.statusCode = response.status
  res.statusMessage = response.statusText
  for (const [name, value] of response.headers) {
    res.setHeader(name, value)
  }
  if (typeof response.body.pipe === 'function') {
    response.body.pipe(res)
  } else {
    res.end(response.body)
  }
}

export { Headers, Request, Response }

export default function (handler: Handler): RequestListener {
  return async function (req, res) {
    try {
      const request = getRequest(req)
      const response = await handler(request)
      if (!(response instanceof Response)) {
        throw TypeError(`response ${response} must be a Response object`)
      }
      applyResponse(response, res)
    } catch (error) {
      console.error(error)
      if (res.headersSent) {
        res.socket.destroy()
      } else {
        res.writeHead(500).end()
      }
    }
  }
}
