import { Bed } from "../type/bed.type";
import { InventorySeed } from "../type/inventory-seed.type";
import { StockSeed } from "../type/stock-seed.type";
import { Task, TaskStatus, TaskWithStringDate } from "../type/task.type";

export class DataBuilderService {
    readonly tomatoSowingDate = { enabled: true, day: 13, month: 3 };
    readonly tomatoTransplantingDate = { enabled: true, day: 12, month: 7 };
    readonly tomatoDaysBeforeHarvest = 30;
    readonly tomatoSeedId = '1';
    readonly seedId = '10';
    readonly seedIdWithMultipleTasks = '11';

    buildTomatoSeeds(): InventorySeed[] {
        return [
            {
                id: this.tomatoSeedId, name: 'Tomato',
                family: { id: 1, key: 'Cherry' },
                sowing: this.tomatoSowingDate, transplanting: this.tomatoTransplantingDate,
                daysBeforeHarvest: this.tomatoDaysBeforeHarvest
            }];
    }

    buildTomatoAndPotatoSeeds(): InventorySeed[] {
        return [
            {
                id: this.tomatoSeedId, name: 'Tomato',
                family: { id: 1, key: 'Cherry' },
                sowing: this.tomatoSowingDate, transplanting: this.tomatoTransplantingDate,
                daysBeforeHarvest: this.tomatoDaysBeforeHarvest
            },
            {
                id: '2', name: 'Potato',
                family: { id: 2, key: 'Russet' },
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
        return [{ id: '0', seeds: [] }, { id: this.tomatoSeedId, seeds: [] }];
    }

    buildTwoBedsWithSeeds(): Bed[] {
        return [{ id: '0', seeds: ['10'] }, { id: this.tomatoSeedId, seeds: ['20', '30'] }];
    }

    readonly taskDate = '2025-01-21';
    readonly taskName = 'Task 1';
    readonly taskStatus = 'scheduled';

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
            { id: `${this.seedId}-sowing`, seedId: this.seedId, seedName: this.taskName, action: "sowing", date: this.taskDate, status: this.taskStatus, completed: new Date().toISOString() },
            { id: `${this.seedIdWithMultipleTasks}-transplanting`, seedId: this.seedIdWithMultipleTasks, seedName: "Task 2", action: "transplanting", date: "2025-01-22", status: "done", completed: new Date().toISOString() }
        ];
    }

    buildUnorderedTasks(status: TaskStatus): TaskWithStringDate[] {
        return [
            { id: `${this.seedId}-sowing`, seedId: this.seedId, seedName: "Task 3", action: "sowing", date: "2025-02-22", status: status, completed: new Date().toISOString() },
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
}
