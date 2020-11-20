import React, {useEffect, useRef} from "react";

export const MessageList = (props) => {
    const listRef = useRef()
    useEffect(() =>{
        listRef.current.scrollIntoView({behavior: "smooth"});
    }, [props.messages])
    return(
        <ul className="message-list">
            {props.messages.map(message => {
                return (
                    <li className={message.from} key={message.id} ref={props.messageIdRef}>
                        <div key={`${message.from}-${message.id}`}>
                            {message.from}
                        </div>
                        <div key={`${message.from}-${message.id}-message-body`}>
                            {message.text}
                        </div>
                    </li>
                )
            })}
            <div ref={listRef}></div>
        </ul>

    )
}

