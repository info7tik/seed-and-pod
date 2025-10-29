import { BedService } from "../service/bed.service";
import { InventoryService } from "../service/inventory.service";
import { PermanentStorageService } from "../service/permanent-storage.service";
import { SeedService } from "../service/seed.service";
import { TaskService } from "../service/task.service";
import { YearService } from "../service/year.service";
import { MockClockService } from "./mock-clock.service";
import { MockStorageService } from "./mock-storage.service";

export class MockFactory {
    static storageService: MockStorageService;
    static permanentStorageService: PermanentStorageService;
    static clockService: MockClockService;
    static yearService: YearService;
    static inventoryService: InventoryService;
    static seedService: SeedService;
    static bedService: BedService;
    static taskService: TaskService;

    static get selectedYear(): number {
        return this.yearService.getSelectedYear();
    }

    static initializeMocks(today: Date = new Date()): void {
        this.storageService = new MockStorageService();
        this.storageService.clear();
        this.permanentStorageService = new PermanentStorageService(this.storageService);
        this.clockService = new MockClockService(today);
        this.yearService = new YearService(this.clockService, this.storageService);
        this.inventoryService = new InventoryService(this.permanentStorageService);
        this.seedService = new SeedService(this.yearService, this.inventoryService);
        this.bedService = new BedService(this.yearService);
        this.taskService = new TaskService(this.yearService);
    }
}