import type { LogDataInterface } from "../constants/interface";
import ProfilePic from "../assets/profile.svg";

const ChatWindowSideBar: React.FC<{ logData?: LogDataInterface }> = ({ logData }) => {
    return (
        <div className="w-64 bg-[#075E54] p-4 min-h-screen">
            <div className="flex flex-col items-center">
                <img
                    src={ProfilePic}
                    alt="Profile"
                    className="w-20 h-20 mb-2"
                />
                {logData ? (
                    <div className="text-sm font-semibold text-[#ECE5DD]">
                        <div className="text-center mb-2 border-b border-[#ECE5DD] pb-2 w-full">
                            <h2 className="text-lg font-semibold mb-1">{logData.name}</h2>
                            <p className="text-sm text-[#34B7F1] mb-1">+{logData.number}</p>
                        </div>
                        <div className="w-full text-left">
                            <div className="mb-1">
                                <span className="text-[#34B7F1]">Invite Type:</span>{" "}
                                <span className="text-[#ECE5DD]">{logData.inviteType || "N/A"}</span>
                            </div>
                            <div className="mb-1">
                                <span className="text-[#34B7F1]">Couple's Name:</span>{" "}
                                <span className="text-[#ECE5DD]">{logData.couplesName || "N/A"}</span>
                            </div>
                            <div className="mb-1">
                                <span className="text-[#34B7F1]">Host Name:</span>{" "}
                                <span className="text-[#ECE5DD]">{logData.hostName || "N/A"}</span>
                            </div>
                            <div className="mb-1">
                                <span className="text-[#34B7F1]">Event Date:</span>{" "}
                                <span className="text-[#ECE5DD]">{logData.eventDate || "N/A"}</span>
                            </div>
                            <div className="mb-1">
                                <span className="text-[#34B7F1]">Events:</span>{" "}
                                <span className="text-[#ECE5DD]">
                                    {Array.isArray(logData.events) && logData.events.length > 0
                                        ? logData.events.join(', ')
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold">No Data available</h2>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatWindowSideBar;
