export type TaskStatus = 'scheduled' | 'done' | 'ignored';

export type TaskId = string;

export type TaskProperties = {
    seedId: string;
    name: string;
    date: Date;
    status: TaskStatus;
};

export type Task = TaskProperties & { id: TaskId };