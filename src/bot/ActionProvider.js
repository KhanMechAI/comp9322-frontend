// ActionProvider starter code
import {useState} from "react";
import {DEFAULT_FAREWELL, DEFAULT_GREETING, MISUNDERSTANDING} from "../constants";

// import {getDentistList} from "../services/apis";
function dayOfWeekAsString(dayIndex) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex] || '';
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
        year: a.getFullYear(),
        month: months[a.getMonth()],
        date: a.getDate(),
        day: dayOfWeekAsString(a.getDay()),
        hour: a.getHours(),
        min: a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes(),
    }
}

const formatDList = (data) => {
    let response = ""
    if (Array.isArray(data.dentists) && data.dentists.length) {
        response = "I think you're after a list of dentists. Here are our practitioners:"
        data.dentists.forEach(doc => {
            response += `\r\n\tName: ${doc.first_name} ${doc.last_name}`
            response += `\r\n\tSpecialisation: ${doc.specialisation}\r\n`
        })
        response += "\r\nWould you like to book an appointment with someone?"
    } else {
        response = "We're all booked out! Please try again another time."
    }

    return response
}

function headerDate(date_obj) {
    return `${date_obj.day} ${date_obj.date}-${date_obj.month}-${date_obj.year}`
}

function appointmentSlot(start, end) {
    return `${start.hour}:${start.min} ${start.hour < 12 ? "am" : "pm"} to ${end.hour}:${end.min} ${end.hour < 12 ? "am" : "pm"}`
}

const formatRefNum = (refNumber) => {
    if (!("errors" in refNumber)) {
        return `Your appointment has been booked! \nYour reference number is ${refNumber.reference_number}. You can use this to cancel your appointment`
    } else {
        return "Looks like we're missing some information. Please try rephrasing your request. " +
            "If you could let me know the dentist and the time I should be able to book that in for you."
    }
}

const formatAppt = (appointmentArray) => {
    let fmtResponse = [""]
    let day = ""
    let response = ""
    appointmentArray.forEach(apt => {
        let start_date = timeConverter(apt.date_from)
        let end_date = timeConverter(apt.date_to)
        if (day == "" || day != start_date.day) {
            if (response != "") {
                fmtResponse.push(
                    response
                )
            }
            day = start_date.day
            let header = headerDate(start_date)
            let slot = appointmentSlot(start_date, end_date)
            response = `${header}\n\r\t${slot}`

        } else {
            let slot = appointmentSlot(start_date, end_date)
            response += `\n\r\t${slot}`
        }
    })
    fmtResponse.push(
        response
    )
    return fmtResponse
}

const formatDInfo = (data) => {
    let responseArr = []
    let response = ""
    if (!("errors" in data)) {
        response += `I think you wanted information on ${data.dentist[0].first_name} ${data.dentist[0].last_name}. ` +
            `Dr ${data.dentist[0].first_name} ${data.dentist[0].last_name}'s ` +
            `Specialisation is ${data.dentist[0].specialisation}.\n`
        if (data.appointments.length > 0) {
            response += "They have the following vailability:"
        } else {
            response += "Unfortunately, this dentist doesnt have any availability. Please try checking with someone else."
        }
        responseArr.push(response, ...formatAppt(data.appointments))
    } else {
        response += "Unfortunately this person is not apart of our practice. " +
            "Please refer to our Dentist list or check your spelling."
        responseArr.push(response)
    }
    responseArr.push(
        `Would you like to book an appointment? ` +
        `Let me know what time and I'll assume you're referring to ${data.dentist[0].first_name} ${data.dentist[0].last_name} ` +
        `Just mention the start time, as all our slots are 1 hour. `
    )
    return responseArr
}

function formatPost(payload) {
    return {
        "first_name": payload.dentist.split(" ")[0],
        "last_name": payload.dentist.split(" ")[1],
        "timestamp": Math.floor(Date.parse(payload.timestamp) / 1000)
    }
}

function postAppointment(payload) {
    let url = new URL("http://127.0.0.1:5000/api/v1/appointment")

    console.log(url)
    payload = formatPost(payload)

    return fetch(
        url,
        {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({
                "content-type": "application/json"
            }),
            body: JSON.stringify(payload),
        }).then(response => response.json())
        .then(result => formatRefNum(result));
}

function getDentistList() {
    let url = new URL("http://127.0.0.1:5000/api/v1/dentist")

    console.log(url)

    return fetch(
        url,
        {
            method: 'GET',
        }).then(response => response.json())
        .then(result => formatDList(result));
}

function getDentistInfo(dentist) {
    let url = new URL("http://127.0.0.1:5000/api/v1/dentist/info")

    url.search = new URLSearchParams({
        "first_name": dentist.split(" ")[0],
        "last_name": dentist.split(" ")[1]
    }).toString()
    console.log(url)

    return fetch(
        url,
        {
            method: 'GET',
        }).then(response => response.json())
        .then(result => formatDInfo(result));
}

class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
    }

    greet = () => {
        const greeting = this.createChatBotMessage(DEFAULT_GREETING)
        this.updateChatBotState(greeting)
    }

    farewell = () => {
        const greeting = this.createChatBotMessage(DEFAULT_FAREWELL)
        this.updateChatBotState(greeting)
    }

    clarify = () => {
        const clarifaction = this.createChatBotMessage(MISUNDERSTANDING)
        this.updateChatBotState(clarifaction)
    }

    listDentists = async () => {
        const listDentistResponse = await getDentistList()
        const msg = this.createChatBotMessage(listDentistResponse)
        this.updateChatBotState(msg)
    }

    dentistInfo = async (dentist) => {
        const dentistInfoResponse = await getDentistInfo(dentist)
        dentistInfoResponse.forEach(response => {
            const msg = this.createChatBotMessage(response)
            this.updateChatBotState(msg)
        })
    }

    makeAppointment = async (entities) => {
        const makeApptResponse = await postAppointment(entities)
        const msg = this.createChatBotMessage(makeApptResponse)
        this.updateChatBotState(msg)
    }


    updateChatBotState = (message) => {
        this.setState(
            prevState => ({
                ...prevState, messages: [...prevState.messages, message]
            })
        )
    }
}

export default ActionProvider;