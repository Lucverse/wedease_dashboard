import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";
import { sendMsg } from "../services/api";
import type { ChatMessageInterface, LogDataInterface } from "../constants/interface";

interface DisplayMessage extends ChatMessageInterface {
    isNew?: boolean;
}

const MessageInput: React.FC<{ onSend: (msg: DisplayMessage) => void; logData: LogDataInterface | null; }> = ({
    onSend,
    logData
}) => {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [input]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage: DisplayMessage = {
            _id: `new-${Date.now()}`,
            from: 'system',
            message: input,
            timestamp: new Date().toISOString(),
            status: 'sending',
            isNew: true
        };

        onSend(newMessage);
        setInput("");

        try {
            const res = await sendMsg(logData?.number || "", input);
            if (res.data.success) {
                newMessage.status = 'sent';
            } else {
                newMessage.status = 'failed';
            }
        } catch (error) {
            newMessage.status = 'failed';
        }
    };

    return (
        <div className="flex items-end p-3 text-sm">
            <div className="flex-1 w-full relative">
                <label className="cursor-pointer mr-3 absolute left-3 bottom-4 z-10 pb-0.5">
                    <Paperclip className="w-5 h-5 text-[#128C7E]" />
                    <input type="file" className="hidden" />
                </label>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Type a message"
                    rows={1}
                    className="w-full p-3 pl-12 border border-[#075E54] rounded-3xl bg-[#222D34] text-[#ECE5DD] focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent resize-none overflow-y-auto"
                    style={{ minHeight: '52px', maxHeight: '120px' }}
                />
                <button
                    onClick={handleSend}
                    className="absolute right-2 bottom-3 p-2 bg-[#075E54] cursor-pointer rounded-full text-white hover:bg-[#128C7E] transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};


export default MessageInput;
