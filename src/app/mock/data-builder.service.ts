import { Bed } from "../type/bed.type";
import { InventorySeed } from "../type/inventory-seed.type";
import { StockSeed } from "../type/stock-seed.type";
import { TaskStatus } from "../type/task.type";

export class DataBuilderService {
    readonly tomatoSowingDate = { enabled: true, day: 13, month: 3 };
    readonly tomatoTransplantingDate = { enabled: true, day: 12, month: 7 };
    readonly tomatoDaysBeforeHarvest = 30;

    buildTomatoSeeds(): InventorySeed[] {
        return [
            {
                id: '1', name: 'Tomato',
                family: { id: 1, key: 'Cherry' },
                sowing: this.tomatoSowingDate, transplanting: this.tomatoTransplantingDate,
                daysBeforeHarvest: this.tomatoDaysBeforeHarvest
            }];
    }

    buildTomatoAndPotatoSeeds(): InventorySeed[] {
        return [
            {
                id: '1', name: 'Tomato',
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
        return [{ id: '1', exhausted: true }];
    }

    buildTwoEmptyBeds(): Bed[] {
        return [{ id: '0', seeds: [] }, { id: '1', seeds: [] }];
    }

    buildTwoBedsWithSeeds(): Bed[] {
        return [{ id: '0', seeds: ['10'] }, { id: '1', seeds: ['20', '30'] }];
    }

    readonly taskDate = '2025-01-21';
    readonly taskName = 'Task 1';
    readonly taskStatus = 'scheduled';
    readonly seedId = '10';
    readonly seedIdWithMultipleTasks = '11';

    buildScheduledAndDoneTasks(): any[] {
        return [
            { id: '1', seedId: this.seedId, name: this.taskName, date: this.taskDate, status: this.taskStatus },
            { id: '2', seedId: this.seedIdWithMultipleTasks, name: "Task 2", date: "2025-01-22", status: "done" }
        ];
    }

    buildUnorderedTasks(status: TaskStatus): any[] {
        return [
            { id: '3', seedId: this.seedId, name: "Task 3", date: "2025-02-22", status: status },
            { id: '2', seedId: this.seedIdWithMultipleTasks, name: "Task 2", date: "2025-01-22", status: status },
            { id: '1', seedId: this.seedIdWithMultipleTasks, name: "Task 1", date: "2021-06-20", status: status },
            { id: '4', seedId: this.seedIdWithMultipleTasks, name: "Task 4", date: "2025-06-20", status: status }
        ];
    }
}
