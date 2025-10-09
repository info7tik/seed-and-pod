import { StorageService } from "../service/storage.service";

export class MockStorageService extends StorageService {
    private items: { [key: string]: any } = {};

    override getItem(key: string, defaultValue: any) {
        return structuredClone(this.items[key]) || defaultValue;
    }

    override setItem(key: string, value: any) {
        this.items[key] = value;
        return true;
    }

    override removeItem(key: string) {
        delete this.items[key];
        return true;
    }

    clear() {
        this.items = {};
    }
}