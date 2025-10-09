import { AvailableSeed } from "./available-seed.type";
import { SeedId } from "./seed-id.type";

export type StockSeedProperties = {
    exhausted: boolean;
};

export type StockSeedStruct = { [seedId: SeedId]: StockSeedProperties };

export type StockSeed = StockSeedProperties & AvailableSeed;