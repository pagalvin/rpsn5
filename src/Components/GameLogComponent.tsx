
import React, { Component } from 'react';
import { Paper } from "@material-ui/core";
import { GamestateWatcher, gameStateChangeDetails, GameLogic, gameStateChangeType } from '../Game/GameLogic';
import { TickerComponent } from './TickerComponent';
import { MapLocation } from '../Entities/MapObjects/MapLocation';

// interface gameMessage {
//     msg: string;
// }

interface props { }

interface queuedMessage {
    messageText: string;
    relatedLocation? : MapLocation;
}

interface state {
    oldMessages: queuedMessage[];
    currentMessage: queuedMessage;
}

export class GameLogComponent extends Component<props, state> implements GamestateWatcher {

    private nextUIKeyVal: number = 0;
    private uiKey = () => `GLC_${this.nextUIKeyVal++}`; // react wants something on the "key" on the <div>

    private ignoreChangeLabels: gameStateChangeType[];

    private queuedMessages: queuedMessage[] = [];

    private emptyMessage : queuedMessage = {messageText: "", relatedLocation: undefined};

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            oldMessages: [],
            currentMessage: this.emptyMessage
        }

        this.ignoreChangeLabels = ["Tick", "DeHighlightMapLocation", "HighlightMapLocation"];
    }

    componentDidMount() {
        GameLogic.registerGamestateWatcher(
            { watcher: this });

        this.setState({
            oldMessages: [],
            currentMessage: {messageText: "Initializing...", relatedLocation: undefined} as queuedMessage
        })
    }

    private onTickerCompleted() {
        
        // Move the current message to history
        this.setState({
            oldMessages: [this.state.currentMessage].concat(this.state.oldMessages)
        })

        // if there are any queued messages, then process them
        if (this.queuedMessages.length > 0) {

            this.setState({
                currentMessage: this.queuedMessages.shift() as queuedMessage
            })

            return;
        }

        // If there's no queued message, then we're done.
        this.setState({
            currentMessage: this.emptyMessage
        });

    }

    private loggableMessageFromGameStateChange(args: {gsc: gameStateChangeDetails}) : string {

        if (args.gsc.changeLabel === "Computer Playing Its Turn") {
            return args.gsc.miscDetails + " is playing its turn.";
        }
        else if (args.gsc.changeLabel === "New base constructed") {
            if (args.gsc.relatedBase) {
                const baseLabel = args.gsc.relatedBase.WorldObjectLabel;
                const baseName = args.gsc.relatedBase.Name;
                return `Constructed a new ${baseLabel} base, "${baseName}."`;
            }
            else {
                return `Constructed a new base but I don't know what kind!`;
            }
        }
        else if (args.gsc.changeLabel === "Location Nuked") {

            const loc = args.gsc.relatedLocation;

            if (loc) {
                const msgStart = 
                    (loc.myMap.owningPlayer.isHuman
                        ? "An enemy missile evaded your defenses! "
                        : "One of your missiles evaded the enemy's defenses. "
                    ) +
                    `${ args.gsc.miscDetails} citizens were killed. `;

                const b = args.gsc.relatedBase;
                if (b) {
                    return `${msgStart} The ${b.WorldObjectLabel} base there (${b.Name}) ${b.wasDestroyed ? "was" : "was not"} destroyed.` 
                }
                else {
                    return msgStart;
                }
            }
            else {
                return "A location was nuked.";
            }
        }        

        return args.gsc.changeLabel;
    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        const doIgnore = this.ignoreChangeLabels.filter(igcl => igcl === args.details.changeLabel).length > 0;
        if (doIgnore) { return; }

        // add the message we just got to the queue
        // this.queuedMessages = this.queuedMessages.concat(args.details.changeLabel);
        this.queuedMessages = this.queuedMessages.concat(
            {
                messageText: this.loggableMessageFromGameStateChange({gsc : args.details}),
                relatedLocation: args.details.relatedLocation
            });

        // if we're already processing a message, do nothing
        if (this.state.currentMessage.messageText.length > 0) {
            return;
        }

        // Otherwise, the queue was empty, so process this one.
        // Take the first item from the queue and make it current.
        this.setState({
            currentMessage: this.queuedMessages ? this.queuedMessages.shift() as queuedMessage : {} as queuedMessage
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
                    {this.state.currentMessage.messageText && this.state.currentMessage.messageText.length > 0
                        ?
                        <TickerComponent
                            tickerInterval={25}
                            tickerMessage={this.state.currentMessage.messageText}
                            onRenderCompleteCallback={this.onTickerCompleted.bind(this)} />
                        :
                        null
                    }

                </div>
                <div key={this.uiKey()}>
                    {
                        this.state.oldMessages.map(m => 
                            <div 
                                key={this.uiKey()} 
                                onMouseOver={() => m.relatedLocation ? GameLogic.notifyHighlightMapLocation({mapLocation: m.relatedLocation}): null}
                                onMouseOut={() => m.relatedLocation ? GameLogic.notifyDeHighlightMapLocation({mapLocation: m.relatedLocation}): null}
                            >
                                {m.messageText}
                            </div>
                        )
                    }
                </div>
            </div>
        )

    }
}
