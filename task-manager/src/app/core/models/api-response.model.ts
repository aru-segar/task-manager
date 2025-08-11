export interface ApiError {
    code?: number;
    message: string;
    details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}