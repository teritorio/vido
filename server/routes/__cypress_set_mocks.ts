import { defineEventHandler } from 'h3'
import { rest } from 'msw'
import { SetupServer, setupServer } from 'msw/node'
import { IncomingMessage, ServerResponse } from 'node:http'

let server: SetupServer | undefined = undefined

function cypressSetMocks(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) {
  const chunks: any = []
  req.on('data', (chunk) => {
    chunks.push(chunk)
  })

  req.on('end', () => {
    if (server) {
      server.close()
      console.error('Cypress mock service stoped')
    }

    if (chunks) {
      const json = Buffer.concat(chunks).toString()
      const mocks = JSON.parse(json) as {
        method: string
        url: string
        statusCode: number
        body: Object
      }[]
      const rests = mocks.map((mock) => {
        return rest.get(mock.url, (req, res, ctx) => res(ctx.json(mock.body)))
      })

      server = setupServer(...rests)
      server.listen({
        onUnhandledRequest: ({ method, url }) => {
          console.error(`Cypress mock unhandled ${method} request to ${url}`)
        },
      })
      console.error('Cypress mock service started')
      server.printHandlers()
    }

    res.statusCode = 200
    res.end()
  })
}

export default defineEventHandler((event) => {
  if (process.env.NODE_ENV != 'production') {
    cypressSetMocks(event.node.req, event.node.res)
  }
})
