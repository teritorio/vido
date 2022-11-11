import { mockSSRAPI } from './mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'
import { Event } from '~/lib/trackers'

const hostname = 'https://dev.appcarto.teritorio.xyz'

let consoleError: Cypress.Agent<sinon.SinonSpy>
Cypress.on('window:before:load', (win) => {
  consoleError = cy.spy(win.console, 'error')
})

const asserts: ((event: Event) => void)[] = []

describe('home content', () => {
  before(() => {
    mockSSRAPI(hostname, teritorioReferenceAPIFixture)
    cy.visit('/')
  })

  it('tracks main load', () => {
    // Initial page load
    asserts.push((event: Event) => {
      assert(event.type === 'page', 'Initial page load, check typ')
      // @ts-ignore
      assert(event.path === '/', 'Initial page load, check path')
    })

    // Background change
    cy.get('#background-selector-map-aerial').click()
    asserts.push((event: Event) => {
      assert(
        event.type === 'map_control_event',
        'Background change, check type'
      )
      // @ts-ignore
      assert(event.event === 'background', 'Background change, check event')
    })

    // Navigate into category group
    cy.get('#MenuGroup-21').click()
    asserts.push((event: Event) => {
      assert(event.type === 'menu', 'Navigate into category group, check type')
      // @ts-ignore
      assert(
        event.menuItemId === 21,
        'Navigate into category group, check categoryId'
      )
    })

    // Enable category
    cy.get('#MenuItem-211').click()
    asserts.push((event: Event) => {
      assert(event.type === 'category_event', 'Enable category, check type')
      // @ts-ignore
      assert(event.categoryId === 211, 'Enable category, check categoryId')
    })

    // Click on map POI
    cy.get('#m1').click()
    asserts.push((event: Event) => {
      assert(event.type === 'popup', 'Click on map POI, check typ')
      // @ts-ignore
      assert(event.poiId === 1, 'Click on map POI, check poiId')
    })
    cy.get('#PoiCard-1').should('be.visible')

    // Click on an other map POI
    cy.get('#m2').click({ force: true }) // Force click on non visible element
    asserts.push((event: Event) => {
      assert(event.type === 'popup', 'Click on an other map POI, check type')
      // @ts-ignore
      assert(event.poiId === 2, 'Click on an other map POI, poiId')
    })
    cy.get('#PoiCard-2').should('be.visible')

    cy.wait(100) // Wait for load
  })

  after(() => {
    const events: Event[] =
      consoleError
        .getCalls()
        .filter((call) => call.args[0] === 'Tracking event')
        .map((call) => call.args[1] as Event)
        .reverse() || []

    asserts.forEach((e) => {
      let event = events.pop()
      if (!event) {
        assert(event, 'No more event present')
      } else {
        e(event)
      }
    })

    assert(events.length === 0, 'No extra events')
  })
})
