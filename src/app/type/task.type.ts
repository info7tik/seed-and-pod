export type TaskStatus = 'scheduled' | 'done' | 'ignored';

export type TaskId = string;

export type TaskProperties = {
    name: string;
    date: Date;
    status: TaskStatus;
};

export type Task = TaskProperties & { id: TaskId };