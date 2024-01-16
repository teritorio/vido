// import { defineEventHandler } from 'h3'
// import { IncomingMessage, ServerResponse } from 'node:http'

// import { generateXslStylesheet } from '~/node_modules/nuxt-simple-sitemap/dist/runtime/util/builder'

// // Import by node_modules because access to internal module content

// async function stylesheet(
//   req: IncomingMessage,
//   res: ServerResponse<IncomingMessage>
// ) {
//   res.write(generateXslStylesheet())
//   res.statusCode = 200
//   res.end()
// }

// export default defineEventHandler(
//   async (event) => await stylesheet(event.node.req, event.node.res)
// )
