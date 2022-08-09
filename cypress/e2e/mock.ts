import { APIFixture } from '~/cypress/fixtures/APIFixture'

export function mockSSRAPI(hostname: string, api: APIFixture) {
  const routes: { [route: string]: any } = {
    'settings.json': api.settings,
    'attribute_translations/fr.json': api.attribute_translations.fr,
    'articles.json?slug=non-classe': api.articles,
    'menu.json': api.menu,
    'pois.geojson?idmenu=211&geometry_as=point&short_description=true':
      api.pois,
  }

  Object.entries(routes).forEach(([route, json]) => {
    cy.intercept(route, { body: json })

    // @ts-ignore
    cy.mockSSR({
      hostname,
      method: 'GET',
      path: '/content/api.teritorio/geodata/v0.1/dev/tourism/' + route,
      statusCode: 200,
      body: json,
    })
  })
}
