export enum TaskItemStatus {
    Pending = 0,
    InProgress = 1,
    Completed = 2
}

// Helper for UI
export const TASK_STATUS_OPTIONS: Array<{ value: TaskItemStatus; label: string }> = [
    { value: TaskItemStatus.Pending, label: 'Pending' },
    { value: TaskItemStatus.InProgress, label: 'In Progress' },
    { value: TaskItemStatus.Completed, label: 'Completed' }
];

export function taskStatusToLabel(s: TaskItemStatus | null | undefined): string {
    switch (s) {
        case TaskItemStatus.Pending:
            return 'Pending';
        case TaskItemStatus.InProgress:
            return 'In Progress';
        case TaskItemStatus.Completed:
            return 'Completed';
        default:
            return 'Unknown';
    }
}