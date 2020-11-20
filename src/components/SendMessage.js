import React, {useState} from "react";

const SendMessageForm = ({ send }) => {
    const [message, setMessage] = useState({
        'text': "",
        "from": "user",
    });


    // // On Change
    const onChange = e => {
        setMessage({...message, text: e.target.value});
    };


    // On Submit
    const onSubmit = (e) => {
        e.preventDefault();
        if (message.from === "user") {
            send("MESSAGE", {message: message})
            setMessage({...message, text: ""});
        }
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

export default SendMessageForm;