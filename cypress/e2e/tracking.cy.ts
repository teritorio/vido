import poisCategory211 from '../fixtures/teritorio/references/pois/category/211.json'
import poisCategory22 from '../fixtures/teritorio/references/pois/category/22.json'
import { mockSSRAPI } from '../support/mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'
import type { Event } from '~/lib/trackers'

const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://127.0.0.1:3000': '/fixtures/teritorio/references/',
}

let consoleError: Cypress.Agent<sinon.SinonSpy>
Cypress.on('window:before:load', (win) => {
  consoleError = cy.spy(win.console, 'error')
})

const asserts: ((event: Event) => void)[] = []

describe('home content', () => {
  beforeEach(() => {
    localStorage.setItem('cookie:accepted', 'true')
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture)
    cy.intercept(
      '/content/api.teritorio/geodata/v0.1/dev/tourism/pois/category/22.geojson?geometry_as=point&short_description=false',
      { body: poisCategory22 },
    )
    cy.intercept(
      '/content/api.teritorio/geodata/v0.1/dev/tourism/pois/category/211.geojson?geometry_as=point&short_description=false',
      { body: poisCategory211 },
    )

    cy.viewport(1024, 768)
    cy.visit('/')
  })

  it('tracks main load', () => {
    // Initial page load
    asserts.push((event: Event) => {
      assert(event.type === 'page' && event.path === '/', 'Initial page load')
    })

    // Background change
    cy.get('#background-selector-map-bicycle', { timeout: 30000 }).click()
    asserts.push((event: Event) => {
      assert(event.type === 'map_control_event', 'Background change')
    })

    // Enable category
    cy.get('#MenuItem-22').click()
    asserts.push((event: Event) => {
      assert(
        event.type === 'category_event' && event.categoryId === 22,
        'Enable category',
      )
    })

    // Navigate into category group
    cy.get('#MenuGroup-21').click()
    asserts.push((event: Event) => {
      assert(
        event.type === 'menu' && event.menuItemId === 21,
        'Navigate into category group',
      )
    })

    // Enable category
    cy.get('#MenuItem-211').click()
    asserts.push((event: Event) => {
      assert(
        event.type === 'category_event' && event.categoryId === 211,
        'Enable category',
      )
    })

    // Click on map POI
    cy.get('#m0', { timeout: 10000 }).click()
    asserts.push((event: Event) => {
      assert(event.type === 'popup' && event.poiId === 1, 'Click on map POI')
    })
    cy.get('#PoiCard-1').should('be.visible')

    // Click on an other map POI
    cy.get('#m1').click({ force: true }) // Force click on non visible element
    asserts.push((event: Event) => {
      assert(
        event.type === 'popup' && event.poiId === 2,
        'Click on an other map POI',
      )
    })
    cy.get('#PoiCard-2').should('be.visible')

    cy.wait(100) // Wait for load

    cy.htmlvalidate()
  })

  after(() => {
    const events: Event[]
      = consoleError
        .getCalls()
        .filter(call => call.args[0] === 'Tracking event')
        .map(call => call.args[1] as Event)
        .reverse() || []

    asserts.forEach((e) => {
      const event = events.pop()
      if (!event)
        assert(event, 'No more event present')
      else
        e(event)
    })

    assert(events.length === 0, 'No extra events')
  })
})
