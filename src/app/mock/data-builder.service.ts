import { Bed } from "../type/bed.type";
import { Harvest, HarvestWithStringDate } from "../type/harvest.type";
import { InventorySeed, InventorySeedProperties } from "../type/inventory-seed.type";
import { StockSeed } from "../type/stock-seed.type";
import { Task, TaskStatus, TaskWithStringDate } from "../type/task.type";

export class DataBuilderService {
    readonly tomatoSowingDate = { enabled: true, day: 13, month: 3 };// XXXX-04-13
    readonly tomatoTransplantingDate = { enabled: true, day: 12, month: 7 };// XXXX-08-12
    readonly tomatoDaysBeforeHarvest = 30;
    readonly tomatoSeedId = '1';
    readonly peasSeedId = '10';
    readonly seedIdWithMultipleTasks = '11';

    readonly bedId0 = '0';
    readonly bedId1 = '1';

    readonly taskDate = '2025-01-21';
    readonly taskName = 'Task 1';
    readonly taskStatus = 'scheduled';

    readonly harvestTomatoDate = new Date('2025-06-21');
    readonly harvestPeasDate = new Date('2025-03-22');
    readonly harvestTomatoWeightGrams = 500;
    readonly harvestPeasWeightGrams = 300;

    buildTomatoAndPotatoSeedProperties(): InventorySeedProperties[] {
        return [
            {
                name: 'Tomato',
                group: { name: 'A', color: '#ffd700' },
                sowing: this.tomatoSowingDate, transplanting: this.tomatoTransplantingDate,
                daysBeforeHarvest: this.tomatoDaysBeforeHarvest
            },
            {
                name: 'Potato',
                group: { name: 'D', color: '#0000ff' },
                sowing: this.tomatoSowingDate,
                transplanting: this.tomatoTransplantingDate,
                daysBeforeHarvest: this.tomatoDaysBeforeHarvest
            }
        ];
    }

    buildTomatoSeeds(): InventorySeed[] {
        return [
            {
                id: this.tomatoSeedId, name: 'Tomato',
                group: { name: 'A', color: '#ffd700' },
                sowing: this.tomatoSowingDate, transplanting: this.tomatoTransplantingDate,
                daysBeforeHarvest: this.tomatoDaysBeforeHarvest
            }];
    }

    buildTomatoAndPotatoSeeds(): InventorySeed[] {
        return [
            {
                id: this.tomatoSeedId, name: 'Tomato',
                group: { name: 'A', color: '#ffd700' },
                sowing: this.tomatoSowingDate, transplanting: this.tomatoTransplantingDate,
                daysBeforeHarvest: this.tomatoDaysBeforeHarvest
            },
            {
                id: '2', name: 'Potato',
                group: { name: 'D', color: '#0000ff' },
                sowing: this.tomatoSowingDate,
                transplanting: this.tomatoTransplantingDate,
                daysBeforeHarvest: this.tomatoDaysBeforeHarvest
            }
        ];
    }

    buildStockTomatoSeeds(): StockSeed[] {
        return [{ id: this.tomatoSeedId, exhausted: true }];
    }

    buildTwoEmptyBeds(): Bed[] {
        return [{ id: this.bedId0, seeds: [] }, { id: this.bedId1, seeds: [] }];
    }

    buildTwoBedsWithSeeds(): Bed[] {
        return [{ id: this.bedId0, seeds: ['10'] }, { id: this.bedId1, seeds: ['20', '30'] }];
    }

    buildSowingTomatoTask(): TaskWithStringDate[] {
        return [
            { id: `${this.tomatoSeedId}-sowing`, seedId: this.tomatoSeedId, seedName: this.taskName, action: "sowing", date: this.taskDate, status: this.taskStatus, completed: new Date().toISOString() }
        ];
    }

    buildTransplantingTomatoTask(): TaskWithStringDate[] {
        return [
            { id: `${this.tomatoSeedId}-transplanting`, seedId: this.tomatoSeedId, seedName: this.taskName, action: "transplanting", date: "2025-06-20", status: this.taskStatus, completed: new Date().toISOString() }
        ];
    }

    buildScheduledAndDoneTasks(): TaskWithStringDate[] {
        return [
            { id: `${this.peasSeedId}-sowing`, seedId: this.peasSeedId, seedName: this.taskName, action: "sowing", date: this.taskDate, status: this.taskStatus, completed: new Date().toISOString() },
            { id: `${this.seedIdWithMultipleTasks}-transplanting`, seedId: this.seedIdWithMultipleTasks, seedName: "Task 2", action: "transplanting", date: "2025-01-22", status: "done", completed: new Date().toISOString() }
        ];
    }

    buildUnorderedTasks(status: TaskStatus): TaskWithStringDate[] {
        return [
            { id: `${this.peasSeedId}-sowing`, seedId: this.peasSeedId, seedName: "Task 3", action: "sowing", date: "2025-02-22", status: status, completed: new Date().toISOString() },
            { id: `${this.seedIdWithMultipleTasks}-transplanting`, seedId: this.seedIdWithMultipleTasks, seedName: "Task 2", action: "transplanting", date: "2025-01-22", status: status, completed: new Date().toISOString() },
            { id: `${this.seedIdWithMultipleTasks}-sowing`, seedId: this.seedIdWithMultipleTasks, seedName: "Task 1", action: "sowing", date: "2021-06-20", status: status, completed: new Date().toISOString() },
            { id: `${this.tomatoSeedId}-transplanting`, seedId: this.tomatoSeedId, seedName: "Task 4", action: "transplanting", date: "2025-06-20", status: status, completed: new Date().toISOString() }
        ];
    }

    buildDate(date: string): Date {
        return new Date(date);
    }

    buildTasks(tasks: TaskWithStringDate[]): Task[] {
        return tasks.map(task => ({ ...task, date: new Date(task.date), completed: new Date(task.completed) }));
    }

    buildTomatoAndPeasHarvests(): HarvestWithStringDate[] {
        return [
            {
                seedId: this.tomatoSeedId,
                seedName: 'Tomato',
                weightGrams: this.harvestTomatoWeightGrams,
                date: this.harvestTomatoDate.toISOString()
            },
            {
                seedId: this.peasSeedId,
                seedName: 'Peas',
                weightGrams: this.harvestPeasWeightGrams,
                date: this.harvestPeasDate.toISOString()
            }
        ];
    }

    buildTomatoMultipleHarvests(): HarvestWithStringDate[] {
        return [
            {
                seedId: this.tomatoSeedId,
                seedName: 'Tomato',
                weightGrams: this.harvestTomatoWeightGrams,
                date: this.harvestTomatoDate.toISOString()
            },
            {
                seedId: this.tomatoSeedId,
                seedName: 'Tomato',
                weightGrams: this.harvestTomatoWeightGrams,
                date: "2025-07-22"
            },
            {
                seedId: this.tomatoSeedId,
                seedName: 'Tomato',
                weightGrams: this.harvestTomatoWeightGrams,
                date: "2025-07-25"
            }
        ];
    }

    buildHarvests(harvests: HarvestWithStringDate[]): Harvest[] {
        return harvests.map(harvest => ({ ...harvest, date: new Date(harvest.date) }));
    }
}
