const fs = require('fs');
const path = require('path');
const { Writable } = require('stream');
const { MdWriter } = require('../utils/md-writer');
const { countResultStates } = require('../utils/bru');
const { isNumber } = require('lodash');
require('./run-report-type');

const ICON_CHECK = '✅'; // 🟢:green_circle: 🟩:green_square: 🆗:ok: 💯:100: ✔️:heavy_check_mark: ☑️:ballot_box_with_check: 🐶:dog:
const ICON_FAIL = '❌'; // 🔴:red_circle: 🟥:red_square: ⭕:o: ❗:exclamation: 💥:boom: 🌭:hotdog:

/**
 * @param {RunReport | RunReport[]} report
 * @param {String} outputPath
 * @param {Object} headerAttributes Optional attributes that are appended right after the document header.
 */
const makeMarkdownOutput = async (report, outputPath, headerAttributes) => {
  const fstream = fs.createWriteStream(outputPath, { encoding: 'utf8' });
  writeMarkdownTo(fstream, Array.isArray(report) ? report : [report], headerAttributes);
  fstream.close();
};

/**
 * @param {Writable} writeStream
 * @param {RunReport[]} reports
 * @param {Object} headerAttributes Optional attributes that are appended right after the document header.
 */
const writeMarkdownTo = async (writeStream, reports, headerAttributes) => {
  const writer = new MdWriter(writeStream);
  writer.h1('Bru Run Report');
  writer.quote(collectHeaderAttributes({ ...{ Date: new Date().toISOString() }, ...headerAttributes }));
  // writer.paragraph('')
  writer.h2('Summary');
  writeSummaryTable(writer, reports);
  writer.h2('Details');
  for (const report of reports) writeRequestDetails(writer, report);
};

/**
 * Collects all attributes as key: value strings in given object and creates a concatinated string.
 *
 * @param {Object} headerAttributes
 * @returns {String}
 *
 * @example collectHeaderAttributes({'Environment': 'Test', 'Sandbox': 'safe'})
 * // **Environment:** Test | **Sandbox:** safe
 */
function collectHeaderAttributes(headerAttributes) {
  const headerSub = [];
  for (const key in headerAttributes) {
    if (headerAttributes.hasOwnProperty(key)) headerSub.push(`**${key}:** ${headerAttributes[key]}`);
  }
  return headerSub.join(' | ');
}

/**
 * Appends the details of a single request execution.
 *
 * @param {MdWriter} writer
 * @param {RunReport} report
 */
const writeRequestDetails = async (writer, report) => {
  const reportPass = report.summary.failedAssertions + report.summary.failedRequests + report.summary.failedTests == 0;
  const iterationSuffix = isNumber(report.iterationIndex) ? `# ${report.iterationIndex}` : '';
  writer.h3(getStatusIndicator(reportPass) + ' Iteration ' + iterationSuffix);
  for (const result of report.results) {
    const [total, passed, failed] = countResultStates(result);
    const detailTitle = `${getStatusIndicator(hasRequestPassed(result))} ${result.suitename} - ${passed}/${total} Passed`;
    writer.details(detailTitle, (c) => {
      // prettier-ignore
      c.tableRow('Request', 'Response')
        .tableRow('--', '--')
        .tableRow(
          `**File**<br/>${result.test.filename}`,
          `**Response Code**<br/>${result.response.status}`)
        .tableRow(
          `**Request Method**<br/>${result.request.method}`,
          `**Response Time**<br/>${result.response.responseTime} ms`
        )
        .tableRow(
          `**Request URL**<br/>${result.request.url}`,
          `**Test Duration**<br/>${result.runtime} ms`) // TODO is it seconds?
        .breakLine();
      // prettier-ignore
      const headers = result.request.headers;
      c.h4('Request Headers');
      if (hasProperties(headers)) {
        c.tableRow('Header Name', 'Header Value').tableRow('--', '--');
        for (const key in headers) {
          if (headers.hasOwnProperty(key)) c.tableRow(key, headers[key]);
        }
        c.breakLine();
      } else {
        c.quote('∅');
      }
      // prettier-ignore
      c.h4('Request Body');
      if (result.request.data) {
        // TODO provide language identifier if possible (e.g. 'content-type' header)
        c.code(null, JSON.stringify(result.request.data)).breakLine();
      } else {
        c.quote('∅');
      }

      // prettier-ignore
      c.h4('Response Headers');
      const responseHeaders = result.response.headers;
      if (hasProperties(responseHeaders)) {
        c.tableRow('Header Name', 'Header Value');
        c.tableRow('--', '--');
        for (const key in responseHeaders) {
          if (responseHeaders.hasOwnProperty(key)) c.tableRow(key, responseHeaders[key]);
        }
        c.breakLine();
      } else {
        c.quote('∅');
      }

      // prettier-ignore
      c.h4('Response Body');
      if (result.response.data) {
        c.code(null, JSON.stringify(result.response.data)).breakLine();
      } else {
        c.quote('∅');
      }

      // prettier-ignore
      c.h4('Assertions')
        .tableRow('Expression', 'Operator', 'Operand', 'Status', 'Error')
        .tableRow('----------', '--------', '-------', ':----:', '-----');
      for (const assert of result.assertionResults) {
        c.tableRow(
          assert.lhsExpr,
          assert.operator,
          assert.rhsOperand,
          getStatusIndicator(assert.status),
          assert.error ? JSON.stringify(assert.error) : ''
        );
      }
      c.breakLine();

      // prettier-ignore
      c.h4('Tests')
        .tableRow('Description', 'Status', 'Error')
        .tableRow('-----------', ':----:', '-----');
      for (const test of result.testResults) {
        c.tableRow(test.description, getStatusIndicator(test.status), test.error ? JSON.stringify(test.error) : '');
      }
      c.breakLine();
    });
  }
};


/**
 * Checks if an object is defined and has at least a single property
 * 
 * @param {Object} obj 
 * @returns {Boolean}
 */
const hasProperties = (obj) => {
  return obj && Object.keys(obj).filter(k => obj.hasOwnProperty(k)).length > 0
}

/**
 * @param {boolean|string} value
 * @returns {String}
 */
const getStatusIndicator = (value) => {
  const boolValue = typeof value === 'string' ? value.toLowerCase() === 'pass' : !!value;
  return boolValue ? ICON_CHECK : ICON_FAIL;
};

/**
 *
 * @param {Result} request
 * @returns {boolean}
 */
const hasRequestPassed = (request) => {
  return (
    request.testResults.filter((value) => value.status == 'fail').length == 0 &&
    request.assertionResults.filter((value) => value.status == 'fail').length == 0
  );
};

/**
 * @param {MdWriter} writer
 * @param {RunReport[]} reports
 */
const writeSummaryTable = async (writer, reports) => {
  // writer.addLine('| Iteration | Requests | Assertions | Tests |');
  // writer.addLine('| --------- | -------- | ---------- | ----- |');
  // const summary = report.summary
  const total = getTotalSummary(reports);
  const totalPass = total.requests.failed + total.asserts.failed + total.tests.failed == 0;
  const fmtCell = (total, passed, failed) => `**${total}** \`${ICON_CHECK} ${passed} \\| ${ICON_FAIL} ${failed}\``;
  var totalRuntime = getTotalRuntime(reports);
  writer
    .tableRow('Iteration', 'Status', 'Requests', 'Assertions', 'Tests', 'Runtime')
    .tableRow('---------', ':----:', '--------', '----------', '-----', '--------------')
    .tableRow(
      '*',
      totalPass ? ICON_CHECK : ICON_FAIL,
      fmtCell(total.requests.total, total.requests.passed, total.requests.failed),
      fmtCell(total.asserts.total, total.asserts.passed, total.asserts.failed),
      fmtCell(total.tests.total, total.tests.passed, total.tests.failed),
      `${totalRuntime} s`
    );
  // Add iteration rows
  if (reports.length > 1) {
    for (const item of reports) {
      const summary = item.summary;
      writer.tableRow(
        `${item.iterationIndex ?? ''}`,
        fmtCell(summary.totalRequests, summary.passedRequests, summary.failedRequests),
        fmtCell(summary.totalAssertions, summary.passedAssertions, summary.failedAssertions),
        fmtCell(summary.totalTests, summary.passedTests, summary.failedTests),
        `${getIterationRuntime(item)} s`
      );
    }
  }
  writer.singleLine();
};

/**
 * @param {RunReport[]} reports
 * @returns
 */
const getTotalSummary = (reports) => {
  const result = {
    requests: {
      total: 0,
      failed: 0,
      passed: 0
    },
    asserts: {
      total: 0,
      failed: 0,
      passed: 0
    },
    tests: {
      total: 0,
      failed: 0,
      passed: 0
    }
  };
  for (var i = 0; i < reports.length; i++) {
    const summary = reports[i].summary;
    result.requests.total += summary.totalRequests;
    result.requests.failed += summary.failedRequests;
    result.requests.passed += summary.passedRequests;
    result.asserts.total += summary.totalAssertions;
    result.asserts.failed += summary.failedAssertions;
    result.asserts.passed += summary.passedAssertions;
    result.tests.total += summary.totalTests;
    result.tests.failed += summary.failedTests;
    result.tests.passed += summary.passedTests;
  }
  return result;
};

/**
 * Gets the runtime of all iterations combined
 *
 * @param {RunReport[]} reports
 * @returns {number}
 */
const getTotalRuntime = (reports) => {
  var totalRuntime = 0;
  for (const report of reports) {
    totalRuntime += getIterationRuntime(report);
  }
  return totalRuntime;
};

/**
 * Gets the runtime of a single iteration.
 *
 * @param {RunReport} report
 * @returns {number}
 */
const getIterationRuntime = (report) => {
  var totalRuntime = 0;
  for (const result of report.results) {
    totalRuntime += result.runtime;
  }
  return totalRuntime;
};

module.exports = { makeMarkdownOutput, writeMarkdownTo };
