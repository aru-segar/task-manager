export interface Task {
    id: string;
    title: string;
    createdAt: Date;
    isCompleted: boolean;

    status?: number;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    userId?: string;
}