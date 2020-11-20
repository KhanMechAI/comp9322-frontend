import './App.css';

import React, {useState, useEffect, useRef, useContext} from 'react';

import SendMessageForm from "./components/SendMessage"
import {LOCAL_STORAGE_KEY, SERVER_API} from "./constants";
import {TodayContext, today} from "./helpers/DateContext"
import {DateString} from "./helpers/utils";
import {MessageList} from "./components/MessageList";
import {useMachine,} from "@xstate/react";
import {chatFactory} from "./services/tes";




export default function App() {

    const [messageIdRef, setMessageidref] =  useState(React.createRef())
    const [dateString, setDateString] =  useState(TodayContext)


    const [current, send] = useMachine(chatFactory({dateString}));


    return (
        <div className="app">
            <MessageList messages={current.context.messages} messageIdRef={messageIdRef}/>
            <SendMessageForm
                send={send}
                messageIdRef={messageIdRef}
            />
            {/*<button onClick={clearMessages}>*/}
            {/*    Clear messages*/}
            {/*</button>*/}
        </div>
    )

}
