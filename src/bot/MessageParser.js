// MessageParser starter code

import {WIT_BASE_URL, WIT_TOKEN} from "../constants";
import {DateString} from "../helpers/utils";
import {today} from "../helpers/DateContext";


function getUserIntent(params) {
    let url = new URL(WIT_BASE_URL)

    url.search = new URLSearchParams(params).toString()

    let headers = {'Authorization': `Bearer ${WIT_TOKEN}`}

    return fetch(
        url,
        {
            method: 'GET',
            headers: headers,
        }
    ).then((response) => {
        return response.json()
    });
}


const dateString = DateString(today)

class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
        this.intent = null;
        this.entities = null;
    }

    getParams = (messageText) => {
        return {
            v: dateString,
            q: messageText
        }
    }

    parse = async (message) => {
        if (message != "") {

            let witParams = this.getParams(message)
            const decodedMsg = await getUserIntent(witParams)

            let intent = decodedMsg.intents.length > 0 ? decodedMsg.intents[0].name : "Unknown"
            let entities = decodedMsg.entities // ? decodedMsg.intents[0].name : "Unknown"
            console.log(entities)
            console.log(intent)
            if (intent === "Greeting") {
                this.actionProvider.greet()
            } else if (intent == "Farewell") {
                this.actionProvider.farewell()
            } else if (intent === "DentistList") {
                this.actionProvider.listDentists()
            } else if (intent === "Dentist") {
                if ("wit$contact:contact" in entities) {
                    this.actionProvider.dentistInfo(entities["wit$contact:contact"][0].value)
                } else {
                    this.actionProvider.emptyDentist()
                }
                console.log("retrieve dentists info")
            } else if (intent === "Appointment") {
                console.log("handle appointment")
                if ("wit$contact:contact" in entities && "wit$datetime:datetime" in entities) {
                    let payload = {
                        dentist: entities["wit$contact:contact"][0].value,
                        timestamp: entities["wit$datetime:datetime"][0].value,
                    }
                    if ("traits" in decodedMsg) {
                        if (decodedMsg.traits["wit$on_off"][0].value == "on") {
                            this.actionProvider.makeAppointment(payload)
                        } else {
                            let payload = {
                                dentist: entities["wit$contact:contact"][0].value,
                                timestamp: entities["wit$datetime:datetime"][0].value,
                            }
                            // this.actionProvider.cancelAppointment(payload)
                        }
                    } else {
                        this.actionProvider.makeAppointment(payload)
                    }

                // } else if ("wit$contact:contact" in entities) {
                //     this.actionProvider.emptySlot()
                // } else if ("wit$datetime:datetime" in entities) {
                //     this.actionProvider.emptySlot()
                } else {
                    this.actionProvider.clarify()
                }
            } else if (intent === "Unknown") {
                this.actionProvider.clarify()
            }
            this.intent = intent
            this.entities = entities
        }
    }


}

export default MessageParser;