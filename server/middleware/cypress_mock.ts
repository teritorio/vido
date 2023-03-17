import { defineEventHandler } from 'h3'
import nock from 'nock'
import { IncomingMessage, ServerResponse } from 'node:http'

// Inspired from https://github.com/cypress-io/cypress-mock-ssr
// MIT License

function cypressServerMock(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) {
  const chunks: any = []

  req.on('data', (chunk) => {
    chunks.push(chunk)
  })

  req.on('end', () => {
    const reqBody = JSON.parse(Buffer.concat(chunks).toString())

    const { hostname, method, path, statusCode, body } = reqBody
    const lcMethod = method.toLowerCase()
    // @ts-ignore
    nock(hostname)[lcMethod](path).reply(statusCode, body)
  })
  res.statusCode = 200
  res.end()
}

function cypressClearServerMock(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) {
  nock.restore()
  nock.cleanAll()
  nock.activate()
  res.statusCode = 200
  res.end()
}

export default defineEventHandler((event) => {
  if (process.env.NODE_ENV != 'production') {
    if (event.node.req.url === '/__cypress_clear_mocks') {
      cypressClearServerMock(event.node.req, event.node.res)
    } else if (event.node.req.url === '/__cypress_server_mock') {
      cypressServerMock(event.node.req, event.node.res)
    }
  }
})
