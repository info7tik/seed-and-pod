import { SeedId } from "./seed-id.type";

export type TaskStatus = 'scheduled' | 'done';

export type TaskAction = 'sowing' | 'transplanting';

export type TaskId = string;

export type Task = {
    id: TaskId;
    action: TaskAction;
    seedId: SeedId;
    seedName: string;
    date: Date;
    status: TaskStatus;
};

export type TaskWithStringDate = Omit<Task, 'date'> & { date: string };