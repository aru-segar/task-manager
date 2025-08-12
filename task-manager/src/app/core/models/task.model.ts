import { TaskItemStatus } from "../enums/task-item-status.enum";

export interface Task {
    id: string;
    title: string;
    createdAt: Date;
    isCompleted: boolean;

    status?: TaskItemStatus;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    userId?: string;
}