import { APIFixture } from '~/cypress/fixtures/APIFixture'

export function mockSSRAPI(hostname: string, api: APIFixture) {
  // @ts-ignore
  cy.mockSSR({
    hostname,
    method: 'GET',
    path: '/content/api.teritorio/geodata/v0.1/dev/tourism/settings.json',
    statusCode: 200,
    body: api.settings,
  })

  // @ts-ignore
  cy.mockSSR({
    hostname,
    method: 'GET',
    path: '/content/api.teritorio/geodata/v0.1/dev/tourism/attribute_translations/fr.json',
    statusCode: 200,
    body: api.attribute_translations.fr,
  })

  // @ts-ignore
  cy.mockSSR({
    hostname,
    method: 'GET',
    path: '/content/api.teritorio/geodata/v0.1/dev/tourism/articles.json?slug=non-classe',
    statusCode: 200,
    body: api.articles,
  })

  // @ts-ignore
  cy.mockSSR({
    hostname,
    method: 'GET',
    path: '/content/api.teritorio/geodata/v0.1/dev/tourism/menu.json',
    statusCode: 200,
    body: api.menu,
  })

  // @ts-ignore
  cy.mockSSR({
    hostname,
    method: 'GET',
    path: '/content/api.teritorio/geodata/v0.1/dev/tourism/pois.geojson?idmenu=144575&as_point=true&short_description=true',
    statusCode: 200,
    body: api.pois,
  })
}
