import axios, { type AxiosResponse } from 'axios';
import type { LogDataInterface, LoginResponse, RSVPStats } from '../constants/interface';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

interface LogsResponse {
    tableData: LogDataInterface[];
    stats: RSVPStats;
}

// ---------- Health ----------
export function getHealth() {
    return api.get('/api/wp/health');
}

// ---------- Authentication ----------
export function login(email: string, password: string): Promise<AxiosResponse<LoginResponse>> {
    return api.post('/api/wp/status', { email, password });
}

export function logout(): Promise<AxiosResponse<void>> {
    return api.post('/api/wp/logout');
}

// ---------- Messaging ----------
export function sendMsg(to: string, msgbody: string): Promise<AxiosResponse<any>> {
    return api.post('/api/wp/send-message', {
        to,
        message: msgbody,
    });
}

export function getSendMsgStatus(): Promise<AxiosResponse<any>> {
    return api.get('/api/wp/status');
}

export function getSendMsgStatusById(id: string): Promise<AxiosResponse<any>> {
    return api.get(`/api/wp/status/${id}`);
}

// ---------- Logs ----------
export function getWeddings(): Promise<AxiosResponse<any>> {
    return api.get('/api/logs/weddings');
}

export function getLogs(id?: string): Promise<AxiosResponse<LogsResponse>> {
    return api.get('/api/logs/rsvp', {
        params: id ? { id } : {},
    });
}

export function getLogById(id: string): Promise<AxiosResponse<LogDataInterface>> {
    return api.get(`/api/logs/${id}`);
}

interface ExportResponse {
    message: string;
    fileUrl: string;
}

export function exportLogsToCSV(): Promise<AxiosResponse<ExportResponse>> {
    return api.get('/api/import-export/export');
}

export function uploadFile(formData: FormData): Promise<AxiosResponse> {
    return api.post('/api/import-export/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export function createWedding(weddingData: { coupleNames: string; hostName: string; weddingDate: string; location: string; }): Promise<AxiosResponse<any>> {
    return api.post('/api/logs/weddings', weddingData);
}

export function messageLogsExport({ weddingId }: { weddingId: string }): Promise<AxiosResponse<any>> {
    return api.get(`/api/import-export/export?weddingId=${weddingId}`);
}

export const SOCKET_URL = import.meta.env.VITE_API_SOCKET_URL;