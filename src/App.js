import React, { Component } from 'react';
import io from 'socket.io-client'
import './App.css';

const socket = io('http://localhost:4050')

class Message extends Component {
    render() {
        return (
            <div>
                <label>Anon: </label>
                <span>{ this.props.message }</span>
            </div>
        )
    }
}

class MessageList extends Component {

    render() {
        const messages = this.props.messages.map(msg => {
            return <Message message={msg} />
        })
        
        return (
            <div>
                {messages}
            </div>
        )
    }
}

class EnterMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messageEnter: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
    }

    // Bind text input to component state
    handleChange(event) {
        this.setState({ messageEnter: event.target.value })
    }

    sendMessage() {
        // Doesn't let send empty messages
        if (!this.state.messageEnter);
        else {
            socket.emit("chat message", this.state.messageEnter)
            this.setState({messageEnter: ''})
        }
    }

    render() {
        return (
            <div>
                <input value={ this.state.messageEnter } onChange={this.handleChange} placeholder="Enter a message..."></input>
                <button onClick={ this.sendMessage }>Send</button>
            </div>
        )
    }
}

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            messages: []
        }
        
        this.addMessage = this.addMessage.bind(this)
    }

    addMessage(msg) {
        const messages = this.state.messages
        messages.push(msg)
        this.setState({
            messages: messages
        })
    }

    componentDidMount() {
        socket.on("previous messages", msgs => {
            msgs.map(msg => {
                return this.addMessage(msg.message)
            })
        })
        socket.on("chat message", msg => {
            this.addMessage(msg)
        })
    }

    render() {
        return (
            <div>
                <header>
                    <h1>Real-time React Chat</h1>
                    <EnterMessage />
                </header>
                <MessageList messages={this.state.messages}/>
            </div>
        )
    }
}

export default App;
