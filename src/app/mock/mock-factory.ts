import { YearService } from "../service/year.service";
import { MockClockService } from "./mock-clock.service";
import { MockStorageService } from "./mock-storage.service";

export class MockFactory {
    static storageService: MockStorageService;
    static clockService: MockClockService;


    static initializeMocks(today: Date = new Date()): void {
        this.storageService = new MockStorageService();
        this.storageService.clear();
        this.clockService = new MockClockService(today);
    }
}