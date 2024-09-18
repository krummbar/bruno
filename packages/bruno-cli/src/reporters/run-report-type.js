/**
 * @typedef {Object} Summary
 * 
 * @property {number} totalRequests
 * @property {number} passedRequests
 * @property {number} failedRequests
 * @property {number} totalAssertions
 * @property {number} passedAssertions
 * @property {number} failedAssertions
 * @property {number} totalTests
 * @property {number} passedTests
 * @property {number} failedTests
 */

/**
 * @typedef {'pass' | 'fail'} StatusResult
 */

/**
 * @typedef {Object} AssertionResult
 * 
 * @property {String} uid
 * @property {String} lhsExpr
 * @property {String} rhsExpr
 * @property {String} rhsOperand
 * @property {String} operator
 * @property {StatusResult} status
 */

/**
 * @typedef {Object} TestResult
 * 
 * @property {String} uid
 * @property {String} description
 * @property {StatusResult} status
 * @property {String} error
 * @property {*} actual
 * @property {*} expected
 */

/**
 * @typedef {Object} ResultRequest
 * 
 * @property {String} method
 * @property {String} url
 * @property {Object} headers
 * @property {Object} data
 */

/**
 * @typedef {Object} Result
 * 
 * @property {*} test
 * @property {ResultRequest} request
 * @property {*} response
 * @property {*} error
 * @property {AssertionResult[]} assertionResults
 * @property {TestResult[]} testResults
 * @property {number} runtime
 * @property {String} suitename
 */

/**
 * @typedef {Object} RunReport
 * 
 * @property {number} iterationIndex
 * @property {Summary} summary
 * @property {Result[]} results 
 */