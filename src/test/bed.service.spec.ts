import test from "@playwright/test";
import { DataBuilderService } from "./mock/data-builder.service";
import { MockFactory } from "./mock/mock-factory";

const dataBuilderService = new DataBuilderService();

test('getBeds()', () => {
    MockFactory.initializeMocks();
    const service = MockFactory.bedService;
    test.expect(service.getBeds().length, "should return one bed if there are no beds").toBe(1);
    const saveYears = Object.keys(MockFactory.storageService.getData().years);
    test.expect(saveYears.length, "should not save the beds").toBe(0);
    MockFactory.storageService.setData({
        years: { [MockFactory.selectedYear]: { [service.BEDS_KEY]: dataBuilderService.buildTwoEmptyBeds() } },
        permanent: {},
        selectedYear: MockFactory.selectedYear
    });
    test.expect(service.getBeds().length).toBe(2);
});

test('createBeds()', () => {
    MockFactory.initializeMocks();
    const service = MockFactory.bedService;
    service.createBeds(2);
    const bedIds = new Set(service.getBeds().map(bed => bed.id))
    test.expect(bedIds.size).toBe(2);
    test.expect(bedIds.has('0')).toBe(true);
    test.expect(bedIds.has('1')).toBe(true);
});

test('getBedFromId()', () => {
    MockFactory.initializeMocks();
    const service = MockFactory.bedService;
    MockFactory.storageService.setData({
        years: { [MockFactory.selectedYear]: { [service.BEDS_KEY]: dataBuilderService.buildTwoEmptyBeds() } },
        permanent: {},
        selectedYear: MockFactory.selectedYear
    });
    test.expect(service.getBedFromId('1').id).toBe('1');
    const notExistingBedId = '20';
    test.expect(() => service.getBedFromId(notExistingBedId)).toThrow();
});

test('assignSeedToBed()', () => {
    MockFactory.initializeMocks();
    const service = MockFactory.bedService;
    MockFactory.storageService.setData({
        years: { [MockFactory.selectedYear]: { [service.BEDS_KEY]: dataBuilderService.buildTwoEmptyBeds() } },
        permanent: {},
        selectedYear: MockFactory.selectedYear
    });
    const seedId = '10';
    service.assignSeedToBed(dataBuilderService.bedId1, seedId);
    test.expect(service.getBedFromId(dataBuilderService.bedId1).seeds[0]).toBe(seedId);
    test.expect(service.getBedFromId(dataBuilderService.bedId0).seeds.length).toBe(0);
});

test('removeSeedFromBeds()', () => {
    MockFactory.initializeMocks();
    const service = MockFactory.bedService;
    MockFactory.storageService.setData({
        years: { [MockFactory.selectedYear]: { [service.BEDS_KEY]: dataBuilderService.buildTwoBedsWithSeeds() } },
        permanent: {},
        selectedYear: MockFactory.selectedYear
    });
    const seedId = '30';
    test.expect(service.getBedFromId(dataBuilderService.bedId0).seeds.length).toBe(1);
    test.expect(service.getBedFromId(dataBuilderService.bedId1).seeds.length).toBe(2);
    service.removeSeedFromBeds(seedId);
    test.expect(service.getBedFromId(dataBuilderService.bedId0).seeds.length).toBe(1);
    test.expect(service.getBedFromId(dataBuilderService.bedId1).seeds.length).toBe(1);
    const notExistingSeedId = '40';
    service.removeSeedFromBeds(notExistingSeedId);
    test.expect(service.getBedFromId(dataBuilderService.bedId0).seeds.length).toBe(1);
    test.expect(service.getBedFromId(dataBuilderService.bedId1).seeds.length).toBe(1);
});

