import { SeedId } from "./seed-id.type";

export type HarvestWithStringDate = {
    seedId: SeedId;
    seedName: string;
    weightGrams: number;
    date: string;
};

export type Harvest = Omit<HarvestWithStringDate, 'date'> & { date: Date };