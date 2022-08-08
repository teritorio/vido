import { mockSSRAPI } from './mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'
import { Event } from '~/lib/trackers'

const hostname = 'https://dev.appcarto.teritorio.xyz'

let consoleError: Cypress.Agent<sinon.SinonSpy>
Cypress.on('window:before:load', (win) => {
  consoleError = cy.spy(win.console, 'error')
})

const expects: ((event: Event) => void)[] = []

describe('home content', () => {
  before(() => {
    mockSSRAPI(hostname, teritorioReferenceAPIFixture)
  })

  it('tracks main load', () => {
    // Initial page load
    cy.visit('/')
    expects.push((event: Event) => {
      expect(event.type === 'page')
      expect(event.path === '/')
    })

    // Background change
    cy.get('#background-selector-map-aerial').click()
    expects.push((event: Event) => {
      expect(event.type === 'map_control_event')
      expect(event.event === 'background')
    })
  })

  after(() => {
    const events: Event[] =
      consoleError
        .getCalls()
        .filter((call) => call.args[0] === 'Tracking event')
        .map((call) => call.args[1] as Event)
        .reverse() || []

    expects.forEach((e) => {
      let event = events.pop()
      if (!event) {
        expect(event)
      } else {
        e(event)
      }
    })
  })
})
