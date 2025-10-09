import { SeedId } from "./seed-id.type";

export type InventorySeedProperties = {
    name: string;
    variety: string;
};

export type InventorySeed = InventorySeedProperties & {
    id: SeedId;
};
