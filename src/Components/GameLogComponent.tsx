
import React, { Component } from 'react';
import { Paper } from "@material-ui/core";
import { GamestateWatcher, gameStateChangeDetails, GameLogic, gameStateChangeType } from '../Game/GameLogic';
import { TickerComponent } from './TickerComponent';

interface gameMessage {
    msg: string;
}

interface props { }

interface state {
    oldMessages: string[];
    currentMessage: string;
}

export class GameLogComponent extends Component<props, state> implements GamestateWatcher {

    private nextUIKeyVal: number = 0;
    private uiKey = () => `GLC_${this.nextUIKeyVal++}`;

    private ignoreChangeLabels: gameStateChangeType[];

    private queuedMessages: string[] = [];

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            oldMessages: [],
            currentMessage: ""
        }

        this.ignoreChangeLabels = ["Tick"];
    }

    componentDidMount() {
        GameLogic.registerGamestateWatcher({ watcher: this });

        this.setState({
            currentMessage: "Initialzing..."
        })
    }

    private onTickerCompleted() {
        // console.log(`GameLogComponent: onTickerCompleted: Entering.`);

        // Move the current message to history
        this.setState({
            oldMessages: [this.state.currentMessage].concat(this.state.oldMessages)
        })

        // if there are any queued messages, then process them
        if (this.queuedMessages.length > 0) {
            this.setState({
                currentMessage: this.queuedMessages.shift() as string
            })

            return;
        }

        // If there's no queued message, then we're done.
        this.setState({
            currentMessage: ""
        });

    }

    private loggableMessageFromGameStateChange(args: {gsc: gameStateChangeDetails}) : string {

        if (args.gsc.changeLabel == "Computer Playing Its Turn") {
            return args.gsc.miscDetails + " is playing its turn.";
        }

        return args.gsc.changeLabel;
    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        const doIgnore = this.ignoreChangeLabels.filter(igcl => igcl === args.details.changeLabel).length > 0;
        if (doIgnore) { return; }

        // add the message we just got to the queue
        // this.queuedMessages = this.queuedMessages.concat(args.details.changeLabel);
        this.queuedMessages = this.queuedMessages.concat(this.loggableMessageFromGameStateChange({gsc : args.details}));

        // if we're already processing a message, do nothing
        if (this.state.currentMessage.length > 0) {
            return;
        }

        // Otherwise, the queue was empty, so process this one.
        // Take the first item from the queue and make it current.
        this.setState({
            currentMessage: this.queuedMessages ? this.queuedMessages.shift() as string : ""
        });

    }

    render() {

        return (
            <div className="gameLogContainer">
                <div>
                    <br/>
                    -- Activities Log --
                </div>
                <div>
                    {this.state.currentMessage && this.state.currentMessage.length > 0
                        ?
                        <TickerComponent
                            tickerInterval={25}
                            tickerMessage={this.state.currentMessage}
                            onRenderCompleteCallback={this.onTickerCompleted.bind(this)} />
                        :
                        null
                    }

                </div>
                <div key={this.uiKey()}>
                    {
                        this.state.oldMessages.map(m => <div key={this.uiKey()}>{m}</div>)
                    }
                </div>
            </div>
        )

    }
}
