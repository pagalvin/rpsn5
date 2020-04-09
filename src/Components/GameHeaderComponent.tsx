import React, { Component } from 'react';
import { Game } from '../Entities/gameEntity';
import { GamestateWatcher, GameLogic, gameStateChangeDetails } from '../Game/GameLogic';
import { TickerComponent } from './TickerComponent';
import { Constants } from '../Game/constants';

interface state {
    yearMessage: string,
}

interface props { }

export class GameHeaderComponent extends Component<props, state> implements GamestateWatcher {

    private readonly yearMessageTemplate: string = "(v0.1) The year was blah, a time of blah.";

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            yearMessage: "",
        }

        // Tell the game logic guy that I want to know when impotant things change to game state.
        GameLogic.registerGamestateWatcher({ watcher: this });
    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        // console.log(`GameHeaderComponent: handleGamestateChange: Got a game state change.`);

        if (args.details.changeLabel === "Advance Turn" || args.details.changeLabel === "War Declared") {
            this.forceUpdate();
        }
    }

    render() {

        console.log(`GameHeaderComponent: render: Entering.`);
        const game: Game = Game.getInstance();

        return (
            <div className="gameYearContainer">
                {
                    game.isPeacetime 
                        ? <TickerComponent tickerInterval={25} tickerMessage={`(v${Constants.GAME_VERSION}) The year was ${game.gameYear}, a time of ${game.isPeacetime ? "peace" : "war!"}`} />
                        : <TickerComponent tickerInterval={25} tickerMessage={`(v${Constants.GAME_VERSION}) The year was ${game.gameYear}, where a state of WAR existed in the world.`} />

                }
            </div>
        );

    }
}
