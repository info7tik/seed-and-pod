import test from '@playwright/test';
import { PermanentStorageService } from '../app/service/permanent-storage.service';
import { MockFactory } from './mock/mock-factory';

test('getPermanentData()', () => {
    MockFactory.initializeMocks();
    const service = new PermanentStorageService(MockFactory.storageService);
    const testKey = 'testKey';
    const testValue = 'testValue';
    test.expect(service.getPermanentData()).toEqual({});
    MockFactory.storageService.setData({ years: {}, permanent: { [testKey]: testValue }, selectedYear: 0 });
    test.expect(service.getPermanentData()[testKey]).toBe(testValue);
    const updatedValue = 'updatedValue';
    service.setPermanentData(testKey, updatedValue);
    test.expect(service.getPermanentData()[testKey]).toBe(updatedValue);
});

test('setPermanentData()', () => {
    MockFactory.initializeMocks();
    const service = new PermanentStorageService(MockFactory.storageService);
    const testKey = 'testKey';
    const testValue = 'testValue';
    service.setPermanentData(testKey, { "value": testValue });
    test.expect(service.getPermanentData()[testKey].value).toBe(testValue);
});