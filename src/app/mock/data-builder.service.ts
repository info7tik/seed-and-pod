import { Bed } from "../type/bed.type";
import { InventorySeed } from "../type/inventory-seed.type";
import { StockSeed } from "../type/stock-seed.type";

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

    buildOneTask(): any[] {
        return [{ id: '1', seedId: '10', name: this.taskName, date: this.taskDate, status: this.taskStatus }];
    }

    buildTwoTasks(): any[] {
        return [
            { id: '1', seedId: '10', name: this.taskName, date: this.taskDate, status: this.taskStatus },
            { id: '2', seedId: '11', name: "Task 2", date: "2025-01-22", status: "done" }
        ];
    }
}
