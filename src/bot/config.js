// Config starter code
import {createChatBotMessage} from "react-chatbot-kit";
import {DEFAULT_GREETING} from "../constants";

const config = {
    initialMessages: [createChatBotMessage(DEFAULT_GREETING)]
}

export default config
