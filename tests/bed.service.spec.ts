import test from "@playwright/test";
import { MockStorageService } from "../src/app/mock/mock-storage-service";
import { BedService } from "../src/app/service/bed.service";
import { Bed } from "../src/app/type/bed.type";

test('getBeds()', () => {
    const mockStorageService: MockStorageService = new MockStorageService();
    mockStorageService.clear();
    const service = new BedService(mockStorageService);
    mockStorageService.setItem(service.BEDS_KEY, fill2EmptyBeds());
    test.expect(service.getBeds().length).toBe(2);
});

test('createBeds()', () => {
    const mockStorageService: MockStorageService = new MockStorageService();
    mockStorageService.clear();
    const service = new BedService(mockStorageService);
    service.createBeds(2);
    const bedIds = new Set(service.getBeds().map(bed => bed.id))
    test.expect(bedIds.size).toBe(2);
    test.expect(bedIds.has('0')).toBe(true);
    test.expect(bedIds.has('1')).toBe(true);
});

test('getBedFromId()', () => {
    const mockStorageService: MockStorageService = new MockStorageService();
    mockStorageService.clear();
    const service = new BedService(mockStorageService);
    mockStorageService.setItem(service.BEDS_KEY, fill2EmptyBeds());
    test.expect(service.getBedFromId('1').id).toBe('1');
    const notExistingBedId = '20';
    test.expect(() => service.getBedFromId(notExistingBedId)).toThrow();
});

test('assignSeedToBed()', () => {
    const mockStorageService: MockStorageService = new MockStorageService();
    mockStorageService.clear();
    const service = new BedService(mockStorageService);
    mockStorageService.setItem(service.BEDS_KEY, fill2EmptyBeds());
    const seedId = '10';
    service.assignSeedToBed('1', seedId);
    test.expect(service.getBedFromId('1').seeds[0]).toBe(seedId);
    test.expect(service.getBedFromId('0').seeds.length).toBe(0);
});

test('removeSeedFromBed()', () => {
    const mockStorageService: MockStorageService = new MockStorageService();
    mockStorageService.clear();
    const service = new BedService(mockStorageService);
    mockStorageService.setItem(service.BEDS_KEY, fill2BedsWithSeeds());
    const seedId = '30';
    test.expect(service.getBedFromId('0').seeds.length).toBe(1);
    test.expect(service.getBedFromId('1').seeds.length).toBe(2);
    service.removeSeedFromBed('1', seedId);
    test.expect(service.getBedFromId('0').seeds.length).toBe(1);
    test.expect(service.getBedFromId('1').seeds.length).toBe(1);
    const notExistingSeedId = '40';
    test.expect(() => service.removeSeedFromBed('1', notExistingSeedId)).toThrow();
    test.expect(service.getBedFromId('0').seeds.length).toBe(1);
    test.expect(service.getBedFromId('1').seeds.length).toBe(1);
});

test('getNotAssignedSeeds()', () => {
    const mockStorageService: MockStorageService = new MockStorageService();
    mockStorageService.clear();
    const service = new BedService(mockStorageService);
    mockStorageService.setItem(service.BEDS_KEY, fill2BedsWithSeeds());
    test.expect(service.getNotAssignedSeeds(['10', '20', '30']).length).toBe(0);
    const notAssigned = service.getNotAssignedSeeds(['10', '20', '90']);
    test.expect(notAssigned.length).toBe(1);
    test.expect(notAssigned[0]).toBe('90');
});

function fill2EmptyBeds(): Bed[] {
    return [{ id: '0', seeds: [] }, { id: '1', seeds: [] }];
}

function fill2BedsWithSeeds(): Bed[] {
    return [{ id: '0', seeds: ['10'] }, { id: '1', seeds: ['20', '30'] }];
}