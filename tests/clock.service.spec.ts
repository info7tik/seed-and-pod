import test from '@playwright/test';
import { ClockService } from '../src/app/service/clock.service';

const NB_SECONDS_IN_DAY = 24 * 60 * 60;
const TO_MILLISECONDS = 1000;

test('isFuture()', () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - NB_SECONDS_IN_DAY * TO_MILLISECONDS);
  const tomorrow = new Date(now.getTime() + NB_SECONDS_IN_DAY * TO_MILLISECONDS);
  const service = new ClockService();
  test.expect(service.isFuture(yesterday)).toBe(false);
  test.expect(service.isFuture(now)).toBe(true);
  test.expect(service.isFuture(tomorrow)).toBe(true);
});
