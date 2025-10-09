import { SeedId } from "./seed-id.type";

export type AvailableSeedProperties = {
    name: string;
    variety: string;
};

export type AvailableSeed = AvailableSeedProperties & {
    id: SeedId;
};
