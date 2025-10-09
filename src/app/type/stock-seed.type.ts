import { AvailableSeed } from "./available-seed.type";
import { SeedId } from "./seed-id.type";

export type StockSeedProperties = {
    exhausted: boolean;
};

export type StockSeed = StockSeedProperties & { id: SeedId };
export type StockSeedWithDetails = StockSeedProperties & AvailableSeed;
