import './App.css';

import React, {useState, useEffect} from 'react';

const server_api = "127.0.0.1:5000/api/v1/"

function getAPIURL() {
    return new URL(server_api)
}

function getDentistList(){
    let url = getAPIURL()
    url.pathname += "dentist"

    let chatBotResponse = fetch(
        url,
        {
            method: 'GET',
        })
        .then(res => res.json())
        .then(function (response) {
            // handle success
            console.log(response);
          })
    console.log(chatBotResponse)
}


function processIntent(witPayload) {
    let botResponse = {id: 'bot'}
    if (witPayload.intents.length) {
        botResponse.text = "Sorry, I don't understand, please try rephrasing."
    } else if (witPayload.intents[0].name == "Greeting") {
        botResponse.text = "Hi there! How can I help today?"
    } else if (witPayload.intents[0].name == "Dentist") {
        let dentistList = getDentistList();
        botResponse.text = dentistList.toString()
    }

    return botResponse
}

const SendMessageForm = ({updateMessages}, user_id, date_string) => {
    const [message, setMessage] = useState({
        'text': "",
        "id": "user",
    });

    // // On Change
    const onChange = e => {
        setMessage(e.target.value);
        setMessage({...message, text: e.target.value});
    };

    // On Submit
    const onSubmit = e => {
        e.preventDefault();
        if (message.id == "user") {
            updateMessages(message);
            var today = new Date();
                // var witAPI = witEndpoint

            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var date_string = yyyy + mm + dd;

  //show response bubble?
            setMessage({...message, text: ""});
            let url = new URL('https://api.wit.ai/message')
            let params = {
                v: date_string,
                q: message.text
            }

            url.search = new URLSearchParams(params).toString();


            let headers = {'Authorization': 'Bearer ISUHC7YRI4DUBCR54XWJMZBNIS3LOMTH'}
            let chatBotResponse = fetch(
                url,
                {
                    method: 'GET',
                    headers:headers
                })
                .then(res => res.json())
                .then(function (response) {
                    // handle success
                    console.log(response);
                  })
            console.log(chatBotResponse)
            updateMessages(processIntent(chatBotResponse));

        }
        //Need to do routing api logic here.
        //if message.id == "user" then
        // update messages
        // send text to wit.ai handler
        //else: // i.e. the response is from the chatbot
        // update the messages
        updateMessages(message);
        setMessage({...message, text: ""});
    };


    return (
        <form
            onSubmit={onSubmit}
            className="send-message-form">
            <input
                onChange={onChange}
                value={message.text}
                placeholder="Type your message and hit ENTER"
                type="text"/>
        </form>
    )
}

const MessageList = ({messages}) => {
    return (
        <ul className="message-list">
            {messages.map(message => {
                return (
                    <li key={message.id}>
                        {/*<div>*/}
                        {/*    {message.senderId}*/}
                        {/*</div>*/}
                        <div>
                            {message.text}
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

const App = () => {
    const [messages, setMessages] = useState([]);
    const [userId, setId] = useState('user');





    function updateMessages(setMessages, messages) {
        return function (message) {
            setMessages([...messages, message]);
        };
    }

    var messageListUpdater = updateMessages(setMessages, messages);

    return (
        <div className="app">
            {/* <Title /> */}
            <MessageList messages={messages}/>
            <SendMessageForm updateMessages={messageListUpdater} userId={userId} />
        </div>
    )
}


export default App;
