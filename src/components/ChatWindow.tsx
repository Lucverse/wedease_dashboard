import React, { } from "react";
import { Clock, X, CheckCheck } from "lucide-react";
import type { ChatMessageInterface } from "../constants/interface";

interface DisplayMessage extends ChatMessageInterface {
    isNew?: boolean;
}
const MessageStatus: React.FC<{ status?: string }> = ({ status }) => {
    switch (status) {
        case 'sent':
            return <CheckCheck className="w-3 h-3 inline ml-1 text-gray-400" />;
        case 'failed':
            return <X className="w-3 h-3 inline ml-1 text-red-500" />;
        case 'sending':
        default:
            return <Clock className="w-3 h-3 inline ml-1 text-gray-400" />;
    }
};

const ChatWindow: React.FC<{ messages: DisplayMessage[]; chatHistory?: ChatMessageInterface[] }> = ({
    messages,
    chatHistory
}) => {
    const allMessages: DisplayMessage[] = [
        ...(chatHistory || []).map((msg) => ({
            ...msg,
            isNew: false,
            // Add sent status for all messages from API
            status: msg.from === 'system' ? 'sent' as "sent" : undefined
        })),
        ...messages
    ];

    return (
        <div
            className="flex-1 p-4 overflow-y-auto"
            style={{
                backgroundColor: '#121B22',
                // backgroundImage: 'url(https://i.pinimg.com/1200x/0a/40/04/0a40044ffa8d69ba5005cb3cbb77fbff.jpg)',
                backgroundRepeat: 'repeat',
                backgroundSize: 'auto',
            }}
        >
            {allMessages.map((msg) => (
                <div
                    key={msg._id}
                    className={`mb-2 flex ${msg.from === 'system' ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`
							px-4 py-2 rounded-2xl shadow text-sm break-words
							${msg.from === 'system'
                                ? "text-white rounded-br-none self-end"
                                : "text-[#ECE5DD] bg-[#128C7E] border-[#075E54] rounded-bl-none self-start"}
						`}
                        style={{
                            backgroundColor: msg.from === 'system' ? '#075E54' : '#353535',
                            boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
                            marginBottom: "2px",
                        }}
                    >
                        <span className="whitespace-pre-line">{msg.message}</span>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                            <span className="text-[10px] text-[#bab4ae]">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {/* Only show status for system messages */}
                            {msg.from === 'system' && (
                                <MessageStatus status={msg.isNew ? msg.status : 'sent'} />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default ChatWindow;
