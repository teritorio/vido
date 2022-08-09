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
      assert(event.type === 'page', 'Initial page load')
      // @ts-ignore
      assert(event.path === '/', 'Initial page load')
    })

    // Background change
    cy.get('#background-selector-map-aerial').click()
    asserts.push((event: Event) => {
      assert(event.type === 'map_control_event', 'Background change')
      // @ts-ignore
      assert(event.event === 'background', 'Background change')
    })

    // Navigate into category group
    cy.get('#CategoryButton-21').click()
    asserts.push((event: Event) => {
      assert(event.type === 'category', 'Navigate into category group')
      // @ts-ignore
      assert(event.categoryId === 21, 'Navigate into category group')
    })

    // Enable category
    cy.get('#CategoryListItem-211').click()
    asserts.push((event: Event) => {
      assert(event.type === 'category_event', 'Enable category')
      // @ts-ignore
      assert(event.categoryId === 211, 'Enable category')
    })

    // Click on map POI
    cy.get('#m1').click()
    asserts.push((event: Event) => {
      assert(event.type === 'popup', 'Click on map POI')
      // @ts-ignore
      assert(event.poiId === 1, 'Click on map POI')
    })
    cy.get('#PoiCard-1').should('be.visible')

    // Click on an other map POI
    cy.get('#m2').click({ force: true }) // Force click on non visible element
    asserts.push((event: Event) => {
      assert(event.type === 'popup', 'Click on an other map POI')
      // @ts-ignore
      assert(event.poiId === 2, 'Click on an other map POI')
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
        assert(event, 'Event present')
      } else {
        e(event)
      }
    })

    assert(events.length === 0, 'No extra events')
  })
})
