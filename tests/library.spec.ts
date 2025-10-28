import test from '@playwright/test';
import { range } from '../src/app/service/library';

test('range()', () => {
    test.expect(range(1, 3)).toEqual([1, 2, 3]);
});