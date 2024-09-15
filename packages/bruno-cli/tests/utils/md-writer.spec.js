const { describe, test, expect } = require('@jest/globals');
const { MdWriter } = require('../../src/utils/md-writer');
const { Writable } = require('stream');

class StringStream extends Writable {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _write(chunk, encoding, callback) {
    this.data += chunk.toString();
    callback();
  }

  getString() {
    return this.data;
  }
}

describe('MdWriter', () => {
  test('Verify document write functions', () => {
    const stream = new StringStream();
    const cut = new MdWriter(stream);
    // prettier-ignore
    cut
      .h1('Testcase')
      .h2('Summary')
      .singleLine('First paragraph, first line.')
      .singleLine('First paragraph, second line.')
      .singleLine()
      .append('Second paragraph').append(', first line.').breakLine()
      .singleLine()
      .tableRow('T1', 'T2', 'T3')
      .tableRow(':--', ':--:', '--:')
      .tableRow('R1C1', 'R1C2', 'R1C3')
      .tableRow('R2C1', 'R2C2', 'R2C3')
      .breakLine()
      .h2('Footer')
      .paragraph('Footer paragraph, first line.', 'Footer paragraph, second line.')
      .singleLine('Final line.');
    expect(stream.getString()).toEqual(EXPECT_CONTENT);
  });
});

const EXPECT_CONTENT = `# Testcase

## Summary

First paragraph, first line.
First paragraph, second line.

Second paragraph, first line.

| T1 | T2 | T3 |
| :-- | :--: | --: |
| R1C1 | R1C2 | R1C3 |
| R2C1 | R2C2 | R2C3 |

## Footer

Footer paragraph, first line.
Footer paragraph, second line.

Final line.
`;
