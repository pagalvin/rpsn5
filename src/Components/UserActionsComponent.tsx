import React, { Component } from 'react';
import { GameRules, strategicMoveOptions, tacticalMoveOptions } from "../Game/GameRules";
import { Game } from '../Entities/gameEntity';
import { GameLogic } from '../Game/GameLogic';
import { Button } from '@material-ui/core';
import { TickerComponent } from './TickerComponent';

export interface state {
    isMakingStrategicChoice: boolean;
    isMakingTacticalChoice: boolean;
    isSelectingLocation: boolean;
}

export interface props {

}

interface actionHandlerMappings {
    playerChoice: strategicMoveOptions | tacticalMoveOptions;
    actionHandler: () => void;
}

export class UserActionsComponent extends Component<props, state> {

    private uiIdx: number = 0;
    private readonly uiKey = () => `useractions${this.uiIdx++}`;

    private readonly actionHandlers: actionHandlerMappings[] = [
        {
            actionHandler: this.handleFinishTurn,
            playerChoice: "Skip"
        },
        {
            actionHandler: this.handleBuild,
            playerChoice: "Build"
        },
        {
            actionHandler: this.handleDeclareWar,
            playerChoice: "Declare War"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Spy"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Sue for Peace"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Surrender"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Build ABM Base"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Build Air Base"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Build Army Base"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Build Missile Base"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Build Navy Base"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Build Radar Base"
        }
    ];

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            isSelectingLocation: false,
            isMakingStrategicChoice: true,
            isMakingTacticalChoice: false,
        }
    }

    private getMoveChoiceLabels() {
        return GameRules.getAllowedMoves();
    }

    public componentDidMount() {

    }


    render() {

        const strategicOptions = this.getMoveChoiceLabels().strategicOptions.map(c => this.getChoiceButtonMarkup({forChoice: c}));
        const tacticalOptions = this.getMoveChoiceLabels().tacticalOptions.map(c => this.getChoiceButtonMarkup({forChoice: c}));

        if (this.state.isMakingStrategicChoice) {
            return strategicOptions;
        }
        else {
            return tacticalOptions;
        }

    }

    private getChoiceButtonMarkup(args: {forChoice: strategicMoveOptions | tacticalMoveOptions}) {

        const actionHandler = this.actionHandlers.filter(ah => ah.playerChoice === args.forChoice)[0];

        if (! actionHandler) {
            const err = {
                msg: "UserActionsComponent: getChoiceButtonMarkup: Error: failed to get an action handler for the provided choice.",
                args: args
            };

            console.error(err);
            throw err;
        }

        return (
            <Button key={this.uiKey()} onClick={actionHandler.actionHandler.bind(this)}>
                <TickerComponent tickerInterval={50} tickerMessage={args.forChoice}/>
            </Button>
        )
    }

    private handleDeclareWar() {
        
        console.log(`UserActionsComponent: handleDeclareWar: Entering.`);

    }

    private handleBuild() {
        console.log(`UserActionsComponent: handleBuild: Entering.`);

        this.setState({
            isMakingTacticalChoice: true,
            isMakingStrategicChoice: false
        });


    }
    private handleFinishTurn() {

        GameLogic.advanceTurn();

        this.setState({
            isSelectingLocation: false,
            isMakingStrategicChoice: true,
            isMakingTacticalChoice: false
        })
    }

    private notYetImplemented() {

        console.log(`UserActionComponent: notYetImplemented: entering, advancing turn.`);

        GameLogic.advanceTurn();

        this.setState({
            isSelectingLocation: false,
            isMakingStrategicChoice: true,
            isMakingTacticalChoice: false
        })
    }
}
