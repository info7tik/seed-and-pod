import { SeedId } from "./seed-id.type";

export type TaskStatus = 'scheduled' | 'done';

export type TaskAction = 'sowing' | 'transplanting';

export type TaskId = string;

export type TaskProperties = {
    action: TaskAction;
    seedId: SeedId;
    seedName: string;
    date: Date;
    status: TaskStatus;
};

export type Task = TaskProperties & { id: TaskId };