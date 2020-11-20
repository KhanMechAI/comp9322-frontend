import {Machine, assign} from 'xstate';

const responseEvent = {
    type: 'RESPONSE',
    intent: "DENTIST_LIST"
};

const updateIntent = (context, event) => {
    if (context && event.intents) {
        assign({
            intent: event.intents[0].name,
            entities: event.entities
        })
    }
}

export const chatMachine = Machine({
    id: 'chatMachine',
    initial: "greet",
    context: {
        intent: "",
        entities: {},
        dentist: "",
        appointmentStart: null,
        response: ""
    },
    entry: [
        (context, event) => updateIntent(context, event)
    ],
    states: {
        greet:{
            onDone: 'waitingForResponse'
        },
        waitingForResponse: {
            on: {
                // RESPONSE: [
                //     {
                //         cond: (context, event) => (context.intent && context.intent ==="DentistList"),
                //         target: 'listDentists',
                //         action: (context, event) => ({
                //
                //         })
                //     },
                //     {
                //         cond: (context, event) => (event.intent === "Dentist"),
                //         target: 'getDentistInfo',
                //     },
                //     {
                //         cond: (context, event) => (event.intent === "Appointment"),
                //         target: 'makeAppointment',
                //     },
                //     {
                //         cond: (context, event) => (event.intent === "Appointment"),
                //         target: 'cancelAppointment',
                //     },
                //     {
                //         cond: (context, event) => (event.intent === "Farewell"),
                //         target: 'goodbye',
                //     },
                //     {
                //         target: 'noIntent',
                //     }
                // ],
            },
        },
        processResponse:{},
        // noIntent: {
        //     entry: {},
        //     on: {
        //         RESPONSE: [
        //             {
        //                 // cond: 'getList',
        //                 target: 'listDentists',
        //             },
        //             {
        //                 // cond: 'getInfo',
        //                 target: 'getDentistInfo',
        //             },
        //             {
        //                 // cond: 'wantAppointment',
        //                 target: 'makeAppointment',
        //             },
        //             {
        //                 // cond: 'removeAppointment',
        //                 target: 'cancelAppointment',
        //             },
        //             {
        //                 // cond: 'isGoodbye',
        //                 target: '..goodbye',
        //             },
        //         ],
        //     },
        // },
        // listDentists: {
        //     //invoke??
        //     entry: [
        //         (context, event) => {
        //             //
        //             console.log(context)
        //             console.log(event)
        //         }
        //     ]
        // },
        // getDentistInfo: {},
        // cancelAppointment: {},
        // makeAppointment: {},

        goodbye: {}
    },
    // guards:{
    //
    //
    // }
})
