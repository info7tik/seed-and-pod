import test from '@playwright/test';
import { MockFactory } from './mock/mock-factory';
import { YearService } from '../app/service/year.service';
import { InventoryService } from '../app/service/inventory.service';
import { PermanentStorageService } from '../app/service/permanent-storage.service';
import { DataBuilderService } from './mock/data-builder.service';
import { TaskService } from '../app/service/task.service';
import { BedService } from '../app/service/bed.service';

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
    const scheduledTasks = taskService.getScheduledTasks();
    test.expect(scheduledTasks.length).toBe(2);
    test.expect(taskService.getDoneTasks().length).toBe(0);
    test.expect(scheduledTasks[0].date.getMonth() + 1).toBe(dataBuilderService.tomatoSowingDate.month);
    yearService.saveSelectedYear(secondYear);
    test.expect(taskService.getScheduledTasks().length).toBe(0);
});