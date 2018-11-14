import React, { Component } from 'react';
import { GameRules, strategicMoveOptions, tacticalMoveOptions } from "../Game/GameRules";
import { GameLogic, GamestateWatcher, gameStateChangeDetails } from '../Game/GameLogic';
import { Button } from '@material-ui/core';
import { TickerComponent } from './TickerComponent';
import { BuildManifestComponent } from './BuildManifestComponent';
import { HumanPlayer } from '../Game/HumanPlayer';
import { BaseActivatorComponent } from './BaseActivatorComponent';

export interface state {
    isMakingStrategicChoice: boolean;
    isMakingTacticalChoice: boolean;
    isSelectingLocation: boolean;
    isBuilding: boolean;
    tacticalChoice: tacticalMoveOptions;
    strategicChoice: strategicMoveOptions | null;
    isWaitingForMyTurn: boolean;
    isActivating: boolean;
}

export interface props {
    player: HumanPlayer;
}

interface actionHandlerMappings {
    playerChoice: strategicMoveOptions | tacticalMoveOptions;
    actionHandler: () => void;
}

export class UserActionsComponent extends Component<props, state> implements GamestateWatcher {

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
            actionHandler: this.handleActivate,
            playerChoice: "Activate"
        },
        {
            actionHandler: this.handleActivate,
            playerChoice: "Activate Base"
        },
        {
            actionHandler: this.handleSpy,
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
            playerChoice: "ABM"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Air"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Army"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Missile"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Navy"
        },
        {
            actionHandler: this.notYetImplemented,
            playerChoice: "Radar"
        }
    ];

    constructor(props: props, state: state) {
        super(props, state);

        this.setInitialState();

        this.state = {
            isSelectingLocation: false,
            isMakingStrategicChoice: true,
            isMakingTacticalChoice: false,
            isBuilding: false,
            tacticalChoice: null,
            strategicChoice: null,
            isWaitingForMyTurn: false,
            isActivating: false
        };

        GameLogic.registerGamestateWatcher({watcher: this});

    }

    private getMoveChoiceLabels() {
        return GameRules.getAllowedMoves();
    }

    private setInitialState() {
        this.setState({
            isBuilding: false,
            isMakingStrategicChoice: true,
            isMakingTacticalChoice: false,
            isSelectingLocation: false,
            tacticalChoice: null,
            strategicChoice: null,
            isWaitingForMyTurn: false
        });
    }

    public componentDidMount() {

    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {

        console.log(`GameHeaderComponent: BuildManifestComponent: Got a game state change.`);

        if (args.details.changeLabel === "Advance Turn") {
            this.setInitialState();
        }

        if (args.details.changeLabel === "Computer Playing Its Turn") {
            this.setState({isWaitingForMyTurn: true});
        }
    }

    render() {

        const strategicOptions = this.getMoveChoiceLabels().strategicOptions.map(c => this.getChoiceButtonMarkup({forChoice: c}));
        const tacticalOptions = this.getMoveChoiceLabels().tacticalOptions.map(c => this.getChoiceButtonMarkup({forChoice: c}));

        const waitingMarkup = () => (
            <TickerComponent tickerInterval={25} tickerMessage="Waiting for the computer to finish its move..."/>
        )

        if (this.state.isWaitingForMyTurn) { return waitingMarkup()}

        if (this.state.isMakingStrategicChoice) {
            return strategicOptions;
        }

        if (this.state.isBuilding) {
            return (
                <BuildManifestComponent 
                    allowedBasesToBuild={this.getMoveChoiceLabels().tacticalOptions} 
                    totalAllowedToBuild={GameRules.getTotalBasesAllowedToBuild({basedOnStrategicChoice: this.state.strategicChoice})}
                />
            )
        }

        if (this.state.isActivating) {
            return (
                <BaseActivatorComponent/>
            );
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
                <TickerComponent tickerInterval={50} tickerMessage={args.forChoice as string}/>
            </Button>
        )
    }

    private handleDeclareWar() {
        
        console.log(`UserActionsComponent: handleDeclareWar: Entering.`);

        GameLogic.declareWar({declaringPlayer: this.props.player});

        this.handleFinishTurn();

    }

    private handleBuild() {

        console.log(`UserActionsComponent: handleBuild: Entering.`);

        this.setState({
            isMakingTacticalChoice: true,
            isMakingStrategicChoice: false,
            isBuilding: true,
            strategicChoice: "Build",
            tacticalChoice: null
        });
    }

    private handleActivate() {
        console.log(`handleActivate: Entering.`);
        this.setState(
            {
                isActivating: true,
                isMakingStrategicChoice: false,
                isMakingTacticalChoice: true
            });
    }

    private handleSpy() {

        console.log(`UserActionsComponent: handleSpy: Entering.`);

        this.setState({
            isMakingTacticalChoice: true,
            isMakingStrategicChoice: false,
            isBuilding: true,
            strategicChoice: "Spy",
            tacticalChoice: null
        });
    }

    private handleFinishTurn() {

        this.setState({
            isSelectingLocation: false,
            isMakingStrategicChoice: true,
            isMakingTacticalChoice: false,
            isBuilding: false
        })

        GameLogic.finishHumanTurn();

    }

    private notYetImplemented() {

        console.log(`UserActionComponent: notYetImplemented: entering, advancing turn.`);

        GameLogic.advanceTurn();

        this.setState({
            isSelectingLocation: false,
            isMakingStrategicChoice: true,
            isMakingTacticalChoice: false,
            isBuilding: false
        })
    }
}
