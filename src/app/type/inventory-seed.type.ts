import { SeedId } from "./seed-id.type";
import { VegetableGroup } from "./vegetable-group.type";

export type SeedDate = {
    enabled: boolean;
    day: number;
    month: number;
};

export type InventorySeedProperties = {
    name: string;
    group: VegetableGroup;
    sowing: SeedDate;
    transplanting: SeedDate;
    daysBeforeHarvest: number;
};

export type InventorySeed = InventorySeedProperties & {
    id: SeedId;
};
