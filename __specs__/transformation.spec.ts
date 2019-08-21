import * as path from 'path';
import { transformFileSync } from '@babel/core';

test('Transformations', () => {
  expect(transformFileSync(path.join(__dirname, '__fixtures__/index.ts'))!.code)
    .toMatchInlineSnapshot(`
    "\\"use strict\\";

    Object.defineProperty(exports, \\"__esModule\\", {
      value: true
    });
    exports.r9 = exports.r8 = exports.r7 = exports.r6 = exports.r5 = exports.r4 = exports.r3 = exports.r2 = exports.r1 = void 0;

    const fn = i => i;

    const r1 = true ? true : false;
    exports.r1 = r1;
    const r2 = true ? true : undefined;
    exports.r2 = r2;
    const r3 = false ? true : undefined;
    exports.r3 = r3;
    const r4 = false ? true : false;
    exports.r4 = r4;
    const r5 = fn(2 === 2 ? 'equals' : 'unequal');
    exports.r5 = r5;
    const r6 = fn(fn(2 === 2) ? 'equals' : 'unequal');
    exports.r6 = r6;
    const r7 = fn(fn(2 !== 2) ? 'equals' : 3 === 3 ? 'nextEquals' : undefined);
    exports.r7 = r7;
    const r8 = fn(fn(2 !== 2) ? 'equals' : 3 !== 3 ? 'nextEquals' : 4 === 4 ? 'furtherNextEquals' : undefined);
    exports.r8 = r8;
    const r9 = ( // If branch goes here:
    true ? true : false ? true : undefined) ? // Then branch goes here:
    true ? true : false ? true : undefined : // else branch goes here:
    true ? true : false ? true : undefined;
    exports.r9 = r9;"
  `);
});
