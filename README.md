# About

An expression-oriented fluent alternative to javascript's if-statement that compiles away to ternary expressions

## Example

Source:

```js
import If from '@allganize/if-expr.macro';

processResult(
  If(2 === 2)
    .then('equals')
    .else('unequal')()
);
```

Compiled output:

```js
processResult(2 === 2 ? 'equals' : 'unequal');
```

## Why ?

1. Javascript if-else statements are not expressions.
2. Ternary expressions are ugly and even more so when nested.
3. Solutions like [lodash.cond](https://lodash.com/docs/latest#cond) have unnecessary function invocation overhead and are less readable.
   To ensure lazy evaluation we need to wrap each branch in function.

This plugin is likely to become obsolete once [do-expressions](https://github.com/tc39/proposal-do-expressions) become supported by typescript ([Relevant issue](https://github.com/Microsoft/TypeScript/issues/13156)).
If you don't care about type checking, then you can try out [this babel-plugin](https://babeljs.io/docs/en/babel-plugin-proposal-do-expressions).

## Installation

This utility is implemented as a [babel-macro](https://github.com/kentcdodds/babel-plugin-macros).

Refer babel's [setup instructions](https://babeljs.io/setup) to learn how to setup your project to use [babel](https://babeljs.io) for compilation.

1. Install `babel-plugin-macros` and `if-expr.macro`:

```sh
npm install --save-dev babel-plugin-macros @allganize/if-expr.macro
```

2. Add babel-plugin-macros to .babelrc (if not already preset):

```js
// .babelrc

module.exports = {
  presets: [
    // ... other presets
  ],
  plugins: [
    'babel-plugin-macros', // <-- REQUIRED
    // ... other plugins
  ],
};
```

3. Import `if-expr.macro` in your code:

```js
// src/foo.js

import If from '@allganize/if-expr.macro';

const result = If(true).then(true)();
```

## Features

- Branches are evaluated lazily

```js
const result = If(true)
  .then(someFn())
  .else(someOtherFn())();

// result is what someFn returns
// someOtherFn is never called
```

- then/else branches are optional

```js
const result = If(false).then(someFn())();

// someFn is never called
// result is undefined
```

- Multiple then/else branches are allowed:

```js
const result = If(true)
  .then(someFn())
  .then(someOtherFn())();

// Both someFn and someOtherFn are called
// result is what someOtherFn returns
```

```js
const result = If(false)
  .then(someFn())
  .elseIf(true)
  .then(someOtherFn())();

// Only someOtherFn is called
// result is what someOtherFn returns
```

- Side-effect only branches:

```js
If(true)
  .thenDo(someFn(), someOtherFn(), yetAnotherFn())
  .thenDo(someOtherFn())();

// All of the functions are called (in specified order), but their return values are discareded
// The expression evaluates to undefined
```

- Side-effect only branches can be combined with then/else branches:

```js
const result = If(true)
  .then(someFn())
  .thenDo(someOtherFn())();

// result is what someFn returns
// returned value (if any) of someOtherFn is discarded
```

## Usage with TypeScript

This library is type-safe and comes with type definitions.

All code must be processed through babel. Compilation through tsc (only) is not supported.

Recommended babel configuration:

```js
// .babelrc

module.exports = {
  presets: [
    '@babel/preset-typescript',
    // ... other presets
  ],
  plugins: [
    'babel-plugin-macros',
    // ... other plugins
  ],
};
```

### Flow based type inference

One caveat is that TypeScript's flow-based type inference will not treat `.then`, `.else` branches same as normal `if/else` branches.

```js
const a: undefined | string = getSomeValue();

if (a) {
  someFnThatExpectsString(a); // Not an error because TypeScript is smart enough to know
  // that a can not be undefined in this branch
}
```

```js
const a: undefined | string = getSomeValue();

If(a).then(someFnThatexpectsString(a as string))()
                                     |________|
// We need to identify  -.             ^
// a as a string to      |------------/
// prevent type error   -'
```

AFAIK, currently there is no workaround for feasible.

## Caveats

Every If/then/else chain fluent must end with a final function invocation without interruptions.

For example:

```js
const a = 10;
const intermediate = If(a === 10).then('equal');
const result = intermediate();
```

Above code will fail to compile.

Because the entire If/then/else chain is compiled away, anything return by If/then/else can not be assigned, referenced, or used in any computation.

## You may also like:

1. **[switch-expr.macro](https://github.com/ts-delight/switch-expr.macro):** Similar utility, providing a fluent expression-oriented macro replacement for switch statement

## License

MIT
