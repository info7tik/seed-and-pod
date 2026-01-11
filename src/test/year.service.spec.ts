import test from '@playwright/test';
import { YearService } from '../app/service/year.service';
import { MockFactory } from './mock/mock-factory';

test('getItem()', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const defaultValue = 'defaultValue';
  const testKey = 'testKey';
  const testValue = 'testValue';
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  test.expect(service.getItemByYear(testKey, defaultValue)).toBe(defaultValue);
  MockFactory.storageService.setData({ years: { [2022]: { testKey: testValue } }, permanent: {}, selectedYear: 0 });
  test.expect(service.getItemByYear(testKey, defaultValue)).toBe(testValue);
});

test('setItem()', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const testKey = 'testKey';
  const testValue = 'testValue';
  const selectedYear = 2022;
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  service.setItemByYear(testKey, testValue);
  test.expect(MockFactory.storageService.getData().years[selectedYear][testKey]).toBe(testValue);
  const updatedValue = 'updatedValue';
  service.setItemByYear(testKey, updatedValue);
  test.expect(MockFactory.storageService.getData().years[selectedYear][testKey]).toBe(updatedValue);
});

test('getSelectedYear() without data', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  test.expect(service.getSelectedYear()).toBe(2022);
  MockFactory.storageService.setData({ years: {}, permanent: {}, selectedYear: 2025 });
  test.expect(service.getSelectedYear()).toBe(2025);
});

test('getYears()', () => {
  const today = new Date(2022, 6, 21);
  MockFactory.initializeMocks(today);
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  test.expect(service.getYears()).toEqual([2023, 2022, 2021]), "should return the current year, the previous years and the next year";
  MockFactory.storageService.setData({ years: { [2020]: {}, [2021]: {}, [2022]: {} }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getYears()).toEqual([2023, 2022, 2021, 2020, 2019]);
  MockFactory.storageService.setData({ years: { [2020]: {}, [2021]: {} }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getYears()).toEqual([2023, 2022, 2021, 2020, 2019]);
  MockFactory.storageService.setData({ years: { [2020]: {}, [2022]: {} }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getYears()).toEqual([2023, 2022, 2021, 2020, 2019]);
  MockFactory.storageService.setData({ years: { [2022]: {}, [2023]: {} }, permanent: {}, selectedYear: 2022 });
  test.expect(service.getYears()).toEqual([2023, 2022, 2021]);
});

test('saveSelectedYear()', () => {
  MockFactory.initializeMocks(new Date(2022, 6, 21));
  const service = new YearService(MockFactory.clockService, MockFactory.storageService);
  service.saveSelectedYear(2025);
  test.expect(service.getSelectedYear()).toBe(2025);
});
