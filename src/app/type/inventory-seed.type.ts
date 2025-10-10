import { SeedId } from "./seed-id.type";
import { VegetableFamily } from "./vegetable-family";

export type SeedDate = {
    enabled: boolean;
    day: number;
    month: number;
};

export type InventorySeedProperties = {
    name: string;
    family: VegetableFamily;
    sowing: SeedDate;
    transplanting: SeedDate;
    daysBeforeHarvest: number;
};

export type InventorySeed = InventorySeedProperties & {
    id: SeedId;
};
