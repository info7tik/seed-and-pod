import { SeedId } from "./seed-id.type";

export type InventorySeedProperties = {
    name: string;
    variety: string;
    sowingDate?: string;
    transplantingDate?: string;
    daysBeforeHarvest?: number;
};

export type InventorySeed = InventorySeedProperties & {
    id: SeedId;
};
