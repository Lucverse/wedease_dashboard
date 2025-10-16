import type { LogDataInterface } from "./interface";

export const initialLogData: LogDataInterface = {
    _id: "",
    name: "",
    number: "",
    inviteType: "",
    couplesName: "",
    hostName: "",
    eventDate: "",
    events: [],
    response: "yes", //hardcoding it for now cause giveing typescript issue
    attachment: "",
    // attempts: [], // Uncommented for build ,, define when needed
    chatHistory: [],
};