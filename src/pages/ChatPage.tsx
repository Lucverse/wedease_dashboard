import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getLogById } from "../services/api";
import { initialLogData } from "../constants/initialData";
import type { ChatMessageInterface, LogDataInterface } from "../constants/interface";

import ChatWindowSideBar from "../components/ChatWindowSideBar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

interface DisplayMessage extends ChatMessageInterface {
	isNew?: boolean;
}

const ChatPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [messages, setMessages] = useState<DisplayMessage[]>([]);
	const [logData, setLogData] = useState<LogDataInterface>(initialLogData);

	const fetchMessages = async () => {
		if (!id) return;
		try {
			const res = await getLogById(id);
			setLogData(res.data || initialLogData);
		} catch (error) {
			console.error("Error fetching log:", error);
		}
	};

	useEffect(() => {
		fetchMessages();
	}, [id]);

	const handleSendMessage = (msg: DisplayMessage) => {
		setMessages((prev) => [...prev, msg]);
	};

	return (
		<div className="flex h-screen bg-[#121B22]">
			<div className="flex flex-col flex-1 font-normal">
				<ChatWindow messages={messages} chatHistory={logData?.chatHistory} />
				<MessageInput onSend={handleSendMessage} logData={logData} />
			</div>
			<ChatWindowSideBar logData={logData} />
		</div>
	);
};

export default ChatPage;
