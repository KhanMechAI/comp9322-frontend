import React, {useState, useEffect, useRef, useContext} from 'react';
import {DEFAULT_GREETING, MISUNDERSTANDING, SERVER_API, WIT_BASE_URL, WIT_TOKEN} from "../constants";


export function getAPIURL(params) {

    let url = new URL(SERVER_API)
    if (params && Object.keys(params).length) {
        url.search = new URLSearchParams(params).toString();
    }
    return url
}

export async function getUserIntent(params) {
    let url = new URL(WIT_BASE_URL)

    url.search = new URLSearchParams(params).toString()

    let headers = {'Authorization': `Bearer ${WIT_TOKEN}`}

    return fetch(
        url,
        {
            method: 'GET',
            headers: headers,
        }
    ).then((response) => response.json());
}


export async function getAppointments(dentist) {
    let url = getAPIURL()
    url.search = new URLSearchParams({dentist: dentist}).toString()
    url.pathname += "appointment"

    let apiResponse = await fetch(
        url,
        {
            method: 'GET',
        })

    console.log(apiResponse);
    let data = await apiResponse.json();
    console.log(data);

    let response = ""
    if (Array.isArray(data.appointments) && data.appointments.length) {
        response = "I think you're after a list of dentists. Here are our practitioners:"
        data.appointments.forEach(appt => {
            response += `\r\n\tName: ${appt.first_name} ${appt.last_name}`
            response += `\r\n\tSpecialisation: ${appt.specialisation}\r\n`
        })
        response += "\r\nWould you like to book an appointment with someone?"
    } else {
        response = "We're all booked out! Please try again another time."
    }
    console.log(response);
    return response
}

export async function getDentistList() {
    let url = getAPIURL()

    url.pathname += "dentist"
    console.log(url)

    let apiResponse = await fetch(
        url,
        {
            method: 'GET',
        })

    let data = await apiResponse.json();


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


export async function getDentist(dentist) {
    let url = getAPIURL()
    url.search = new URLSearchParams({dentist: dentist}).toString()
    url.pathname += "dentists"

    let apiResponse = await fetch(
        url,
        {
            method: 'GET',
        })
    console.log(apiResponse);
    let data = await apiResponse.json();
    console.log(data);

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
    console.log(response);
    return response
}