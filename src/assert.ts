import { robustStringify } from "./text";
import type { PrimitiveTypes } from "./types";

/// An assertion error is thrown when an assertion fails.
export class AssertionError extends Error {
	toString() {
		return 'Assertion' + super.toString();
	}
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type Constructor<T> = Function & { prototype: T };

/**
 * Assert that [[condition]] is true.
 * @param condition - If not true, throw or console.trace if recoverable is true as well.
 * @param message - An optional message to send with the exception.
 */
export function assert(condition: boolean, message: string | null = null): asserts condition {
	if (!condition) {
		message = message !== null ? `Assertion failed: ${message}` : 'Assertion failed!';
		throw new AssertionError(message);
	}
}

/**
 * Always throw, has the never type to be used in if and case blocks
 * @param message - An optional message to send with the exception.
 */
export function assertFalse(message: string | null = null): never {
	message = message !== null ? `Assertion failed: ${message}` : 'Assertion failed!';
	throw new AssertionError(message);
}

/**
 * Assert that [[value]] is a string.
 * @param value The value to test.
 * @param name user-readable name of the value.
 */
export function assertString(value: unknown, name: string): asserts value is string {
	if (typeof value === 'string') {
		return;
	}
	assertFalse(`${name} (${value}) is not a string`);
}

/**
 * Assert that [[object]] is an instance of [[type]].
 * In contrast to assertType the compiler will not check that [[object]] actually extends [[type]] (prefer the former if it also works)
 * @param type The type to test to, this allows to pass abstract classes using [[Constructor]] type.
 * @param object object to test.
 * @param name user-readable name of the object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertTypeAny<U>(type: Constructor<U>, object: any, name: string): asserts object is U {
	if (object instanceof type) {
		return;
	}
	assertFalse(`${name} (${robustStringify(object)}) is not a ${type.name}`);
}

/**
 * Assert that [[object]] is an instance of [[type]].
 * @param type The type to test to, this allows to pass abstract classes using [[Constructor]] type.
 * @param object object to test.
 * @param name user-readable name of the object.
 */
export function assertType<T, U extends T>(type: Constructor<U>, object: T, name: string): asserts object is U {
	assertTypeAny(type, object, name);
}

/**
 * Assert that [[objects]] is an array of instances of type.
 * @param type The type to test to, a primitive type string returned by the typeof operator.
 * @param objects array to test.
 * @param name user-readable name of the array.
 */
export function assertValidArrayPrimitive(type: PrimitiveTypes, objects: unknown, name: string) {
	assertType(Array, objects, name);
	let i = 0;
	for (const object of objects) {
		assert(typeof object === type, `${name}[${i}] is of type ${typeof object} instead of ${type}`);
		i += 1;
	}
}

/**
 * Assert that [[objects]] is an array of string.
 * @param objects array to test.
 * @param name user-readable name of the array.
 */
export function assertValidArrayString(objects: unknown, name: string): asserts objects is string[] {
	assertValidArrayPrimitive('string', objects, name);
}