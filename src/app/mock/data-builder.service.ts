import { Bed } from "../type/bed.type";
import { InventorySeed } from "../type/inventory-seed.type";
import { StockSeed } from "../type/stock-seed.type";
import { TaskStatus } from "../type/task.type";

export class DataBuilderService {
    readonly tomatoSowingDate = { enabled: true, day: 13, month: 3 };
    readonly tomatoTransplantingDate = { enabled: true, day: 12, month: 7 };
    readonly tomatoDaysBeforeHarvest = 30;
    readonly tomatoSeedId = '1';
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
    readonly seedId = '10';
    readonly seedIdWithMultipleTasks = '11';

    buildSowingTomatoTask(): any[] {
        return [
            { id: '1', seedId: this.tomatoSeedId, seedName: this.taskName, action: "sowing", date: this.taskDate, status: this.taskStatus }
        ];
    }

    buildTransplantingTomatoTask(): any[] {
        return [
            { id: '1', seedId: this.tomatoSeedId, seedName: this.taskName, action: "transplanting", date: "2025-06-20", status: this.taskStatus }
        ];
    }

    buildScheduledAndDoneTasks(): any[] {
        return [
            { id: '1', seedId: this.seedId, seedName: this.taskName, action: "sowing", date: this.taskDate, status: this.taskStatus },
            { id: '2', seedId: this.seedIdWithMultipleTasks, seedName: "Task 2", action: "transplanting", date: "2025-01-22", status: "done" }
        ];
    }

    buildUnorderedTasks(status: TaskStatus): any[] {
        return [
            { id: '3', seedId: this.seedId, seedName: "Task 3", action: "sowing", date: "2025-02-22", status: status },
            { id: '2', seedId: this.seedIdWithMultipleTasks, seedName: "Task 2", action: "transplanting", date: "2025-01-22", status: status },
            { id: '1', seedId: this.seedIdWithMultipleTasks, seedName: "Task 1", action: "sowing", date: "2021-06-20", status: status },
            { id: '4', seedId: this.seedIdWithMultipleTasks, seedName: "Task 4", action: "transplanting", date: "2025-06-20", status: status }
        ];
    }
}
