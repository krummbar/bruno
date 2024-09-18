const { Writable } = require('stream');
const os = require('os');

/**
 * @callback detailComposer
 * @param {MdWriter} writer - The MdWriter instance passed through to the callback function
 */

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
   * Add a header level 3 and empty line.
   *
   * @param {String} value
   * @returns
   *
   * @example writer.h3('Title')
   * // ### Title
   * //
   */
  h3(value) {
    return this.singleLine('### ' + value).singleLine();
  }

  /**
   * Add a header level 4 and empty line
   * 
   * @param {String} value 
   * @returns
   * 
   * @example writer.h4('Title')
   * // #### Title
   * // 
   */
  h4(value) {
    return this.singleLine('#### ' + value).singleLine();
  }

  /**
   * Adds a quotation block.
   * 
   * @param {String} value 
   * @returns 
   * 
   * @example writer.quote('This is a quote');
   * // > This is a quote
   * //
   */
  quote(value) {
    return this.singleLine('> ' + value).breakLine();
  }

  /**
   * Inserts a collapsible details section.
   *
   * @example writer.details('Show details', c => c.singleLine('This request has failed due to many reasons.'));
   * // <details>
   * // <summary>Show details</summary>
   * //
   * // This request has failed due to many reasons.
   * //
   * // </summary>
   *
   * @param {String} title
   * @param {detailComposer} contentComposer
   * @returns
   */
  // prettier-ignore
  details(title, contentComposer) {
    this.singleLine('<details>')
      .append('<summary>').append(title).append('</summary>').breakLine()
      .breakLine();
    contentComposer(this);
    this.breakLine()
      .singleLine('</details>');
    return this;
  }

  /**
   * Inserts a code snipped for an optional given language
   * 
   * @param {String} lang Optional language identifier
   * @param {String} content The actual code content to insert inside the code block.
   * @returns
   * 
   * @example writer.code('js', 'console.log("Hello world!"));
   * // ```js
   * // console.log("Hello world!");
   * // ```
   * //
   */
  code(lang, content) {
    this.append('```');
    if (lang) this.append(lang);
    this.breakLine();
    this.append(content).breakLine();
    this.singleLine('```').breakLine();
    return this;
  }

  /**
   * Inserts several columns formatted as table row.
   *
   * @param {...String} columns
   * @returns
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
