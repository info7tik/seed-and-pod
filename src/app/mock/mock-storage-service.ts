import { StorageService } from "../../app/storage.service";

export class MockStorageService extends StorageService {
    private items: { [key: string]: any } = {};

    override getItem(key: string, defaultValue: any) {
        return this.items[key] || defaultValue;
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