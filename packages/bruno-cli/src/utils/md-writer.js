const { Writable } = require('stream');
const os = require('os');

/**
 * Wraps a writable stream and provides utility operations to compose a markdown document.
 *
 * @example
 * // Create document and write a markdown document using MdWriter
 * const md = new MdWriter(fs.createWriteStream(outputPath));
 * md.h1('Title')
 *   .append('Hello ').append(username).breakLine()
 *   .breakLine()
 *   .paragraph('This is the first paragrah.')
 *   .h2('Sub-Section')
 *   .singleLine('First paragraph of sub-section.')
 */
class MdWriter {
  /**
   * @type {Writable};
   */
  #stream;

  /**
   * @param {Writable} stream
   */
  constructor(stream) {
    this.#stream = stream;
  }

  /**
   * Append the given value to internal stream without any modification.
   *
   * @param {String} value
   * @returns {MdWriter}
   */
  append(value) {
    this.#stream.write(value ?? '');
    return this;
  }

  /**
   * Appends the given value and finishes with a line break.
   *
   * @param {String} value
   * @returns {MdWriter}
   *
   * @example
   * writer
   *    .singleLine("I've to say something...");
   *    .singleLine("Woof!");
   * // Effectively the same result as
   * writer
   *    .append("I've to say something...").breakLine()
   *    .append("Woof!").breakLine();
   */
  singleLine(value) {
    this.#stream.write((value ?? '') + os.EOL);
    return this;
  }

  /**
   * Adds a markdown paragraph. Each provided string is added as a single line.
   * The paragraph is followed by an empty line.
   *
   * @param  {...String} lines
   * @returns
   *
   * @example writer.paragraph("I've to say something...", "Woof!");
   * // I've to say something...
   * // Woof!
   * //
   */
  paragraph(...lines) {
    for (var i = 0; i < lines.length; i++) {
      this.singleLine(lines[i]);
    }
    return this.breakLine();
  }

  /**
   * Appends a os-specific line break.
   *
   * @returns {MdWriter}
   */
  breakLine() {
    this.#stream.write(os.EOL);
    return this;
  }

  /**
   * Add a header level 1 and empty line.
   *
   * @param {String} value
   * @returns
   *
   * @example writer.h1('Title')
   * // # Title
   * //
   */
  h1(value) {
    return this.singleLine('# ' + value).singleLine();
  }

  /**
   * Add a header level 2 and empty line.
   *
   * @param {String} value
   * @returns
   *
   * @example writer.h2('Title')
   * // ## Title
   * //
   */
  h2(value) {
    return this.singleLine('## ' + value).singleLine();
  }

  /**
   * Inserts several columns formatted as table row.
   *
   * @param {...String} columns
   * @return {MdWriter}
   *
   * @example writer.tableRow('Iteration 1', 10, 6, 'Foobar')
   * // | Iteration 1 | 10 | 6 | Foobar |
   */
  tableRow(...columns) {
    for (var i = 0; i < columns.length; i++) {
      this.append(`| ${columns[i]} `);
    }
    return this.append('|').breakLine();
  }

  // close() {
  //   this.#stream.close();
  // }
}

module.exports = {
  MdWriter
};
