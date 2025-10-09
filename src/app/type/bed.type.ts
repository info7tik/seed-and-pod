import { SeedId } from "./seed-id.type";

export type BedId = string;

export type Bed = {
    id: BedId;
    seeds: SeedId[];
};