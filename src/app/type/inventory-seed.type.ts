import { SeedId } from "./seed-id.type";
import { Family } from "./vegetable-group.type";

export type SeedDate = {
    enabled: boolean;
    day: number;
    month: number;
};

export type InventorySeedProperties = {
    name: string;
    family: Family;
    sowing: SeedDate;
    transplanting: SeedDate;
    daysBeforeHarvest: number;
};

export type InventorySeed = InventorySeedProperties & {
    id: SeedId;
};
