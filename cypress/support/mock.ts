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

  const mocks = Object.entries(hostnames)
    .map(([hostname, path]) =>
      Object.entries(routes).map(([route, json]) => ({
        method: 'GET',
        url: hostname + path + route,
        statusCode: 200,
        body: json,
      }))
    )
    .flat(1)

  cy.request('POST', '/__cypress_set_mocks', mocks)
}
