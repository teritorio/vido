import './commands'
require('cypress-terminal-report/src/installLogsCollector')()

// Cypress.on('uncaught:exception', (err, runnable) => {
// 	if (err.message.includes('t.layout is undefined')) {
// 		return false
// 	}
// })
