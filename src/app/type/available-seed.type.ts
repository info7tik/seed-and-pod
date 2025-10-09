import { SeedId } from "./seed-id.type";

export type AvailableSeed = {
    name: string;
    variety: string;
};

export type AvailableSeedStruct = { [seedId: SeedId]: AvailableSeed };