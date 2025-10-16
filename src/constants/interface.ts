export interface ChatMessageInterface {
    _id: string;
    from: string;
    message: string;
    timestamp: string;
    status?: 'sending' | 'sent' | 'failed';
}

export interface LogDataInterface {
    _id: string;
    name: string;
    number: string;
    inviteType: string;
    couplesName: string;
    hostName: string;
    eventDate: string;
    events: string[];
    response: 'yes' | 'no';
    attachment: string;
    chatHistory: ChatMessageInterface[];
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

export interface RSVPStats {
    inviteTypes: { type: string; count: number; percentage: string }[];
    statuses: { status: string; count: number; percentage: string }[];
    responses: { yes: { count: number; percentage: string }; no: { count: number; percentage: string } };
}

export interface WeddingInterface {
    _id: string;
    coupleNames: string;
    hostName: string;
    weddingDate: string;
    location: string;
    createdAt: string;
    updatedAt: string;
}