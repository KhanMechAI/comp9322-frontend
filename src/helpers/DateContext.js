import React from 'react'
import {DateString} from "./utils";

export let today = new Date()


export const TodayContext = React.createContext(
    DateString(today)
)