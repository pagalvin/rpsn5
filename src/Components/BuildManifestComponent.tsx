import React, { Component } from 'react';
import { tacticalMoveOptions } from '../Game/GameRules';
import { MilitaryBaseTypes } from '../Entities/WorldObjects/Bases/MilitaryBaseTypes';
import { MapLocation } from '../Entities/MapObjects/MapLocation';
import { TickerComponent } from './TickerComponent';
import { GamestateWatcher, gameStateChangeDetails, GameLogic } from '../Game/GameLogic';
import { Constants } from '../Game/constants';
import { buildBaseResult } from './MapComponent';

interface props {
    allowedBasesToBuild: tacticalMoveOptions[],
    totalAllowedToBuild: number;
}

interface buildSelection {
    buildWhat: MilitaryBaseTypes | null;
    buildWhere: MapLocation | null;
    didBuild: boolean;
    buildResultText: string | null;
}

interface state {
    buildManifest: buildSelection[];
}

export class BuildManifestComponent extends Component<props, state> implements GamestateWatcher {

    private uiIdx: number = 0;
    private readonly uiKey = () => this.uiIdx++;
    private readonly emptyManifestSelection: buildSelection = { buildWhat: null, buildWhere: null, didBuild: false, buildResultText: null };

    constructor(props: props, state: state) {
        super(props, state);

        this.state = {
            buildManifest: []
        }

        // Tell the game logic guy that I want to know when impotant things change to game state.
        GameLogic.registerGamestateWatcher({ watcher: this });

    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {
        // const game: Game = Game.getInstance();

        console.log(`GameHeaderComponent: BuildManifestComponent: Got a game state change.`);

    }

    componentDidMount() {

        // console.log(`BuildManifestComponent: componentDidMount: state and props:`, { state: this.state, props: this.props});


        this.setState({
            buildManifest: new Array(this.props.totalAllowedToBuild).fill(this.emptyManifestSelection)
        });

    }

    private handleDropResult(args: {result: buildBaseResult}) {
        console.log(`BuidManifestComponent: handleDropResult: drop finished, result:`, args.result);

        this.setState({
            buildManifest: this.state.buildManifest.reduce( (prev, curr, idx) => {

                if (idx === args.result.manifestIndex) {
                    const newBuildManfest: buildSelection = {
                        buildWhat: null,
                        buildWhere: null,
                        didBuild: args.result.didSucceed,
                        buildResultText: args.result.message
                    }

                    console.log(`BuidManifestComponent: handleDropResult: updated manifest:`, {updatedManifest: newBuildManfest});

                    return prev.concat(newBuildManfest);
                }
                else {
                    return prev.concat(curr);
                }

            }, [] as buildSelection[])
        })
    }

    render() {

        console.log(`BuildManifestComponent: render: Entering with props and state:`, {props: this.props, state: this.state});

        const allowedBaseMarkup = (args: {forManifestIndex: number}) => {
            return (
                this.props.allowedBasesToBuild.map((allowedBase, idx) => (
                    <span key={this.uiKey()}
                        draggable
                        onDragStart={
                            (e) => {
                                console.log(`BuildManifestComponent: tacticalOptionsMarkup: onDragStart: e, ab:`, 
                                { 
                                    e: e, 
                                    ab: allowedBase,
                                    manifestIndex: idx
                                })
                                e.dataTransfer.setData("baseType", allowedBase as string);
                                e.dataTransfer.setData("manifestIndex", args.forManifestIndex.toString());
                                (window as any)[Constants.NOTIFY_BUILD_RESULT_CALLBACK_NAME] = this.handleDropResult.bind(this);
                            }
                        }

                        onDragEnd={
                            (e) => {
                                console.log(`BuildManifestComponent: tacticalOptionsMarkup: onDragEnd: e, ab:`,
                                    { e, ab: allowedBase }
                                )
                            }
                        }
                    >
                        {allowedBase} |&nbsp;
                </span>
                )))
        };

        const qtyMessage = () => {
            return (
                this.props.totalAllowedToBuild > 1
                    ? <div>
                        <TickerComponent tickerInterval={20} tickerMessage={`You are allowed to build ${this.props.totalAllowedToBuild} bases.`} /></div>
                    : <div>{`You are allowed to build 1 base.`}</div>
            );
        };

        const manifestMarkup = () => {

            console.log(`BuildManifestComponent: manifestMarkup: building up a selection:`, this.state.buildManifest);

            return this.state.buildManifest.map((selection, idx) => {
                return (
                    <div key={this.uiKey()}>
                        Option: {idx}: &nbsp;
                        Build what: {selection.didBuild ? selection.buildResultText : allowedBaseMarkup({forManifestIndex: idx})}
                        &nbsp;
                        Did Build? {selection.didBuild ? "Yes" : "No"}
                        {
                            (selection.buildResultText && ! selection.didBuild) ? selection.buildResultText : null
                        }
                    </div>
                )
            });
        }

        const tacticalOptionsMarkup = () => {

            const baseMarkup = this.props.allowedBasesToBuild.map(allowedBase => (
                <span key={this.uiKey()}
                    draggable
                    onDragStart={
                        (e) => {
                            console.log(`BuildManifestComponent: tacticalOptionsMarkup: onDragStart: e, ab:`, { e: e, ab: allowedBase })
                            e.dataTransfer.setData("baseType", allowedBase as string);
                        }
                    }
                >
                    {allowedBase} |&nbsp;
                </span>
            ))

            return (
                <div>
                    Build:
                    {baseMarkup}
                </div>
            )
        }

        const toRender = (
            <React.Fragment>

                {qtyMessage()}

                {tacticalOptionsMarkup()}

                {
                    <div>
                        <h5>Build manifest:</h5>
                        {manifestMarkup()}
                    </div>
                }

            </React.Fragment>
        )

        return toRender;
    }
}
