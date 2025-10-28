import { StorageService } from "../service/storage.service";
import { StorageData } from "../type/storage-data.type";

export class MockStorageService extends StorageService {
    private data: string = JSON.stringify(this.DEFAULT_DATA);

    override getData(): StorageData {
        return JSON.parse(this.data);
    }

    override setData(data: StorageData): void {
        this.data = JSON.stringify(data);
    }

    override clear(): void {
        this.data = JSON.stringify(this.DEFAULT_DATA);
    }
}
