import { InventorySeed } from "../type/inventory-seed.type";
import { SeedId } from "../type/seed-id.type";
import { StockSeed } from "../type/stock-seed.type";

export class SeedHelper {
    protected getSeedById<SeedType extends InventorySeed | StockSeed>(availableSeeds: SeedType[], id: SeedId) {
        const seed = availableSeeds.find(s => s.id === id);
        if (!seed) {
            throw new Error(`seed with id ${id} does not exist`);
        }
        return seed;
    }

    protected seedIdExists<SeedType extends InventorySeed | StockSeed>(seeds: SeedType[], id: SeedId): boolean {
        return seeds.some(s => s.id === id);
    }
}