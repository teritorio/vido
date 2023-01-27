import { APIFixture } from '~/cypress/fixtures/APIFixture'

export function mockSSRAPI(
  hostnames: { [hostname: string]: string },
  api: APIFixture,
  routes: { [route: string]: any } = {}
) {
  routes = {
    ...routes,
    'settings.json': api.settings,
    'attribute_translations/fr.json': api.attribute_translations.fr,
    'articles.json?slug=non-classe': api.articles,
    'menu.json': api.menu,
  }

  Object.entries(hostnames).forEach(([hostname, path]) => {
    Object.entries(routes).forEach(([route, json]) => {
      // @ts-ignore
      cy.mockSSR({
        hostname,
        method: 'GET',
        path: path + route,
        statusCode: 200,
        body: json,
      })
    })
  })
}
