export interface ApiResult {
    success: boolean;
    status: number;
    message?: string;
    data?: any;
    errors?: string[];
}