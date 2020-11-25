import './App.css';

import React, {useState, useEffect, useRef, useContext} from 'react';
import Chatbot from "react-chatbot-kit";

import {LOCAL_STORAGE_KEY, SERVER_API} from "./constants";
import {TodayContext, today} from "./helpers/DateContext"
import {DateString} from "./helpers/utils";
// Config starter code

import ActionProvider from './bot/ActionProvider';
import MessageParser from './bot/MessageParser';
import config from './bot/config';

const dateString = DateString(today)

export default function App() {

    return (
        <div className="App">
            <header className="App-header">
                <TodayContext.Provider value={dateString}>
                    <Chatbot
                        config={config}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                    />
                </TodayContext.Provider>
            </header>
        </div>
    );
}