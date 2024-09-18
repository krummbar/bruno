const { describe, test, expect } = require('@jest/globals');
const { countResultStates } = require('../../src/utils/bru');

describe('Run Results', () => {
  test('countResultStates get correct amount', () => {
    const testobject = {
      testResults: [{ status: 'pass' }, { status: 'pass' }, { status: 'fail' }],
      assertionResults: [{ status: 'pass' }, { status: 'fail' }]
    };
    const [total, passed, failed] = countResultStates(testobject);
    expect(total).toEqual(5);
    expect(passed).toEqual(3);
    expect(failed).toEqual(2);
  });

  test('countResultStates does not fail on missing property', () => {
    expect(countResultStates({ testResults: null, assertionResults: undefined })).toEqual([0, 0, 0]);
    expect(countResultStates({ testResults: [], assertionResults: [] })).toEqual([0, 0, 0]);
    expect(countResultStates({})).toEqual([0, 0, 0]);
  });
});
