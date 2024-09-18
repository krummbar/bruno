const { describe, test, expect } = require('@jest/globals');
const { writeMarkdownTo } = require('../../src/reporters/markdown');
const { Writable } = require('stream');

class StringStream extends Writable {
    constructor(options) {
        super(options);
        this.data = '';
    }

    _write(chunk, encoding, callback) {
        this.data += chunk.toString();
        callback();
    };

    getString() {
        return this.data;
    }
}

describe('MarkdownReporter', () => {
  test('Transforms result to markdown', () => {
    const is = new StringStream();
    writeMarkdownTo(is, [SINGLE_RUN], { 'Environment': 'test-env'});
    console.log(is.getString());
    expect(is.getString()).not.toBeNull();
  });
});


const SINGLE_RUN = 
{
  "summary": {
    "totalRequests": 5,
    "passedRequests": 3,
    "failedRequests": 2,
    "totalAssertions": 5,
    "passedAssertions": 4,
    "failedAssertions": 1,
    "totalTests": 5,
    "passedTests": 1,
    "failedTests": 4
  },
  "results": [
    {
      "test": {
        "filename": "echo/echo json.bru"
      },
      "request": {
        "method": "POST",
        "url": "https://testbench-sanity.usebruno.com/api/echo/json",
        "headers": {
          "content-type": "application/json"
        },
        "data": {
          "null": "null"
        }
      },
      "response": {
        "status": 200,
        "statusText": "OK",
        "headers": {
          "content-type": "application/json; charset=utf-8",
          "content-length": "15",
          "connection": "keep-alive"
        },
        "data": {
          "null": "null"
        },
        "responseTime": 1424
      },
      "error": null,
      "assertionResults": [
        {
          "uid": "G6I32DzMTgyB8TEubl4Sc",
          "lhsExpr": "res.status",
          "rhsExpr": "eq 200",
          "rhsOperand": "200",
          "operator": "eq",
          "status": "pass"
        }
      ],
      "testResults": [
        {
          "description": "should return secret message",
          "status": "fail",
          "error": "expected { null: 'null' } to deeply equal { hello: 'secret world!' }",
          "actual": {
            "null": "null"
          },
          "expected": {
            "hello": "secret world!"
          },
          "uid": "QGggREkJOnJKjeUGRoaOU"
        }
      ],
      "runtime": 1.490561757,
      "suitename": "echo/echo json"
    },
    {
      "test": {
        "filename": "echo/echo json.bru"
      },
      "request": {
        "method": "POST",
        "url": "https://testbench-sanity.usebruno.com/api/echo/json",
        "headers": {
          "content-type": "application/json"
        },
        "data": {
          "hello": "bruno"
        }
      },
      "response": {
        "status": 200,
        "statusText": "OK",
        "headers": {
          "content-type": "application/json; charset=utf-8",
          "content-length": "17",
          "connection": "keep-alive"
        },
        "data": {
          "hello": "bruno"
        },
        "responseTime": 627
      },
      "error": null,
      "assertionResults": [
        {
          "uid": "P4HFL4b9RXkI3q3BzmwhL",
          "lhsExpr": "res.status",
          "rhsExpr": "eq 200",
          "rhsOperand": "200",
          "operator": "eq",
          "status": "pass"
        }
      ],
      "testResults": [
        {
          "description": "should return json",
          "status": "pass",
          "uid": "4tc6q3SbBimKcsiqqieJN"
        }
      ],
      "runtime": 0.640684737,
      "suitename": "echo/echo json"
    },
    {
      "test": {
        "filename": "echo/echo xml parsed.bru"
      },
      "request": {
        "method": "POST",
        "url": "https://testbench-sanity.usebruno.com/api/echo/xml-parsed",
        "headers": {
          "content-type": "text/xml"
        },
        "data": "<hello>\n  <world>bruno</world>\n</hello>"
      },
      "response": {
        "status": 200,
        "statusText": "OK",
        "headers": {
          "content-type": "application/json; charset=utf-8",
          "content-length": "29",
          "connection": "keep-alive"
        },
        "data": {
          "hello": {
            "world": [
              "bruno"
            ]
          }
        },
        "responseTime": 380
      },
      "error": null,
      "assertionResults": [
        {
          "uid": "5b2DkcuOutyN6-hKvq4pz",
          "lhsExpr": "res.status",
          "rhsExpr": "eq 200",
          "rhsOperand": "200",
          "operator": "eq",
          "status": "pass"
        }
      ],
      "testResults": [
        {
          "description": "should return parsed xml",
          "status": "pass",
          "uid": "jyf73eUcn-jA5dY_Y6wl6"
        }
      ],
      "runtime": 0.390010507,
      "suitename": "echo/echo xml parsed"
    },
    {
      "test": {
        "filename": "echo/echo plaintext.bru"
      },
      "request": {
        "method": "POST",
        "url": "https://testbench-sanity.usebruno.com/api/echo/text",
        "headers": {
          "content-type": "text/plain"
        },
        "data": "hello"
      },
      "response": {
        "status": 200,
        "statusText": "OK",
        "headers": {
          "content-type": "text/plain; charset=utf-8",
          "content-length": "5",
          "connection": "keep-alive"
        },
        "data": "hello",
        "responseTime": 324
      },
      "error": null,
      "assertionResults": [
        {
          "uid": "Ltwxb2vJieooDJK3m_m_s",
          "lhsExpr": "res.status",
          "rhsExpr": "eq 200",
          "rhsOperand": "200",
          "operator": "eq",
          "status": "pass"
        }
      ],
      "testResults": [
        {
          "description": "should return plain text",
          "status": "pass",
          "uid": "g52vivo7wu8iAMzVuBc47"
        }
      ],
      "runtime": 0.334980899,
      "suitename": "echo/echo plaintext"
    },
    {
      "test": {
        "filename": "ping.bru"
      },
      "request": {
        "method": "GET",
        "url": "https://testbench-sanity.usebruno.com/ping",
        "headers": {}
      },
      "response": {
        "status": 200,
        "statusText": "OK",
        "headers": {
          "content-type": "text/html; charset=utf-8",
          "transfer-encoding": "chunked",
          "connection": "keep-alive"
        },
        "data": "pong",
        "responseTime": 466
      },
      "error": null,
      "assertionResults": [
        {
          "uid": "w25j2_qjY5LL4LxjvHgla",
          "lhsExpr": "res.status",
          "rhsExpr": "eq 200",
          "rhsOperand": "200",
          "operator": "eq",
          "status": "pass"
        }
      ],
      "testResults": [
        {
          "description": "should ping pong",
          "status": "pass",
          "uid": "F03ndKqIyDQUigL-YxcRr"
        }
      ],
      "runtime": 0.477994838,
      "suitename": "ping"
    }
  ]
};