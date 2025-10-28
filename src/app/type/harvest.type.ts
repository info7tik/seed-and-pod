import { SeedId } from "./seed-id.type";

export type HarvestWithStringDate = {
    seedId: SeedId;
    seedName: string;
    weightGrams: number;
    date: string;
};

export interface Harvest extends Omit<HarvestWithStringDate, 'date'> { date: Date };

export interface AggregatedHarvest extends Harvest { count: number };