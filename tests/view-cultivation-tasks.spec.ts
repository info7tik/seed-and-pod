import test from '@playwright/test';
import { MockFactory } from '../src/app/mock/mock-factory';
import { YearService } from '../src/app/service/year.service';
import { InventoryService } from '../src/app/service/inventory.service';
import { PermanentStorageService } from '../src/app/service/permanent-storage.service';
import { DataBuilderService } from '../src/app/mock/data-builder.service';
import { TaskService } from '../src/app/service/task.service';
import { BedService } from '../src/app/service/bed.service';

const dataBuilderService = new DataBuilderService();

test('view cultivation tasks', () => {
    const today = new Date(2024, 8, 21); // 2024-09-21
    MockFactory.initializeMocks(today);
    const yearService = new YearService(MockFactory.clockService, MockFactory.storageService);
    const inventoryService = new InventoryService(new PermanentStorageService(MockFactory.storageService));
    const taskService = new TaskService(yearService);
    const bedService = new BedService(yearService);
    const firstYear = 2024;
    const secondYear = 2025;

    dataBuilderService.buildTomatoAndPotatoSeedProperties().forEach(seed => inventoryService.addInventorySeed(seed));
    const inventorySeeds = inventoryService.getInventorySeeds();
    test.expect(inventorySeeds.length).toBe(2);
    const tomatoSeed = inventorySeeds[0];
    yearService.saveSelectedYear(firstYear);
    bedService.createBeds(2);
    const bed = bedService.getBeds()[0];
    bedService.assignSeedToBed(bed.id, tomatoSeed.id);
    const tasks = taskService.computeTasks(tomatoSeed, firstYear);
    test.expect(tasks.length).toBe(2);
    tasks.forEach(task => taskService.updateTask(task));
    test.expect(taskService.getScheduledTasks().length).toBe(2);
    test.expect(taskService.getDoneTasks().length).toBe(0);
});