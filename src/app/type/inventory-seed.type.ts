import { SeedId } from "./seed-id.type";

export type SeedDate = {
    enabled: boolean;
    day: number;
    month: number;
};

export type InventorySeedProperties = {
    name: string;
    family: string;
    sowing: SeedDate;
    transplanting: SeedDate;
    daysBeforeHarvest: number;
};

export type InventorySeed = InventorySeedProperties & {
    id: SeedId;
};
