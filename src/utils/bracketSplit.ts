'use strict';

// https://github.com/trgwii/bracket-split

// Utils
const isEmpty = (list: string | any[]) =>
	list.length === 0;

const head = (list: any[]) =>
	list[0];

const init = (list: string | any[]) =>
	list.slice(0, -1);

const last = (list: string | any[]) =>
	list[list.length - 1];

const assoc = (key: string, value: any[], obj: any) =>
	({ ...obj, [key]: value });

const merge = (a: any, b: { acc: any[]; escape?: boolean; quoted?: any; stack?: any; }) =>
	({ ...a, ...b });

const append = (list: any, item: string) =>
	[ ...list, item ];

const concatLast = (list: any, str: any) =>
	append(
		init(list),
		(last(list) || '') + str);

// Bracket-related functions
const isOpening = (char: any, brackets: any[]) =>
	brackets.some((x: any) =>
		head(x) === char);

const isClosing = (char: any, brackets: any[]) =>
	brackets.some((x: any) =>
		last(x) === char);

const openingToClosing = (char: any, brackets: any[]) =>
	last(brackets.find((x: any) =>
		head(x) === char) || []);

// Main
const Splitter = (
	delimiter: string | RegExp,
	brackets: string[][],
	quotes: string | any[],
	escaper: string,
	heredocs: string[][]
) =>
	(state: { acc: any; escape: any; quoted: any; stack: any; }, char: string) => {
		const { acc, escape, quoted, stack } = state;
		if (escape) {
			return merge(state, {
				acc: concatLast(acc, char),
				escape: false
			});
		}
		if (char === escaper) {
			return merge(state, {
				acc: concatLast(acc, char),
				escape: true
			});
		}
		if (!quoted && quotes.includes(char)) {
			return merge(state, {
				acc: concatLast(acc, char),
				quoted: char
			});
		}
		if (quoted === char) {
			return merge(state, {
				acc: concatLast(acc, char),
				quoted: false
			});
		}
		if (quoted) {
			return assoc('acc', concatLast(acc, char), state);
		}
		if (isOpening(char, brackets)) {
			if (stack.some((x: any) => isOpening(x, heredocs))) {
				return assoc('acc', concatLast(acc, char), state);
			}
			return merge(state, {
				acc: concatLast(acc, char),
				stack: append(stack, char)
			});
		}
		if (isClosing(char, brackets)) {
			if (
				isEmpty(stack) ||
				char !== openingToClosing(last(stack), brackets)
			) {
				if (stack.some((x: any) => isOpening(x, heredocs))) {
					return assoc('acc', concatLast(acc, char), state);
				}
				throw new SyntaxError('Unexpected closing bracket: ' + char);
			}
			return merge(state, {
				acc: concatLast(acc, char),
				stack: init(stack)
			});
		}
		if (
			(delimiter instanceof RegExp
				? char.match(delimiter)
				: char === delimiter) &&
			isEmpty(stack)
		) {
			return assoc('acc', append(acc, ''), state);
		}
		return assoc('acc', concatLast(acc, char), state);
	};

/**
 * Performs a bracket-aware string split.
 * @param {string|RegExp} delimiter The delimiter to split by.
 * @param {string} str The string to split.
 * @param {Array<string[]>} [brackets] Override the default brackets: { } [ ].
 * @param {string[]} [quotes] Override the default string quotes: ' ".
 * @param {string} [escaper] Override the default escape character: \.
 * @param {Array<string[]>} [heredocs] A set of bracket pairs to use as heredocs (unnestable brackets)
 * @returns {string[]} The splitted string.
 * @throws {SyntaxError} Will throw if the brackets don't match up.
 */
const bracketSplit = (
	delimiter: string | RegExp,
	str: string,
	brackets: Array<string[]> = [ [ '{', '}' ], [ '[', ']' ] ],
	quotes: string[] = [ '\'', '"' ],
	escaper: string = '\\',
	heredocs: Array<string[]> = []
): string[] => {
	const splitter = Splitter(
		delimiter,
		[ ...brackets, ...heredocs ],
		quotes,
		escaper,
		heredocs);
	const result = str
		.split('')
		.reduce(splitter, {
			acc: [],
			escape: false,
			quoted: false,
			stack: []
		});
	if (result.quoted) {
		throw new SyntaxError(
			'Unexpected end of input, expected: ' +
			result.quoted);
	}
	if (!isEmpty(result.stack)) {
		throw new SyntaxError(
			'Unexpected end of input, expected: ' +
			openingToClosing(last(result.stack), brackets));
	}
	return result.acc;
};

export default bracketSplit;
