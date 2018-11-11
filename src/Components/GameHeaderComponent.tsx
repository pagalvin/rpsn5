import React, { Component } from 'react';
import { Game } from '../Entities/gameEntity';
import { GamestateWatcher, GameLogic, gameStateChangeDetails } from '../Game/GameLogic';
import { TickerComponent } from './TickerComponent';

interface state {
    yearMessage: string,
}

interface props { }

export class GameHeaderComponent extends Component<props, state> implements GamestateWatcher {

    private readonly yearMessageTemplate: string = "The year was blah, a time of blah.";

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            yearMessage: "",
        }

        // Tell the game logic guy that I want to know when impotant things change to game state.
        GameLogic.registerGamestateWatcher({ watcher: this });
    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {
        const game: Game = Game.getInstance();

        console.log(`GameHeaderComponent: handleGamestateChange: Got a game state change.`);

        if (args.details.changeLabel === "Advance Turn") {
            this.forceUpdate();

        }
    }

    render() {

        console.log(`GameHeaderComponent: render: Entering.`);
        const game: Game = Game.getInstance();

        // Need a min height or we end up with a flicker.
        const style = {
            "height": "30px"
        }

        return (
            <div style={style}>
                <TickerComponent tickerInterval={25} tickerMessage={`The year was ${game.gameYear}, a time of ${game.isPeacetime ? "peace" : "war!"}`} />
            </div>
        );

    }
}
