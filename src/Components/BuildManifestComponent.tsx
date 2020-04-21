import React, { Component, SyntheticEvent } from 'react';
import { tacticalMoveOptions } from '../Game/GameRules';
import { MilitaryBaseTypes } from '../Entities/WorldObjects/Bases/MilitaryBaseTypes';
import { MapLocation } from '../Entities/MapObjects/MapLocation';
import { TickerComponent } from './TickerComponent';
import { GamestateWatcher, gameStateChangeDetails, GameLogic } from '../Game/GameLogic';
import { Constants } from '../Game/constants';
import { Button } from '@material-ui/core';
import { buildBaseResult } from './MapComponents/MapComponent';
import { UIComponent } from './GameButton';
import { constants } from 'os';

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
        // console.log(`BuildManifestComponent.ts: handleGamestateChange: Got a game state change:`, {details: args.details});
    }

    componentDidMount() {

        // console.log(`BuildManifestComponent: componentDidMount: state and props:`, { state: this.state, props: this.props});

        this.setState({
            buildManifest: new Array(this.props.totalAllowedToBuild).fill(this.emptyManifestSelection)
        });

    }

    private handleDropResult(args: { result: buildBaseResult }) {
        console.log(`BuidManifestComponent: handleDropResult: drop finished, result:`, args.result);

        this.setState({
            buildManifest: this.state.buildManifest.reduce((prev, curr, idx) => {

                if (idx === args.result.manifestIndex) {
                    const newBuildManfest: buildSelection = {
                        buildWhat: null,
                        buildWhere: null,
                        didBuild: args.result.didSucceed,
                        buildResultText: args.result.message
                    }

                    console.log(`BuidManifestComponent: handleDropResult: updated manifest:`, { updatedManifest: newBuildManfest });

                    return prev.concat(newBuildManfest);
                }
                else {
                    return prev.concat(curr);
                }

            }, [] as buildSelection[])
        })
    }

    render() {

        console.log(`BuildManifestComponent: render: Entering with props and state:`, { props: this.props, state: this.state });

        const buildManifestCompletedMarkup = () => {
            return (
                <div>
                    All base assignments complete.
                    <UIComponent.GameButton onClick={
                        () => {
                            //console.log(`BuildManifestComponent: render: manifestCompleteMarkup: finish turn.`)
                            GameLogic.finishHumanTurn();
                        }}>
                        Finish Turn</UIComponent.GameButton>
                </div>
            )
        }

        const dragStartMarkup = (args: { dragEvent: React.DragEvent, baseType: tacticalMoveOptions, manifestIndex: number }) => {
            // console.log(`BuildManifestComponent: tacticalOptionsMarkup: onDragStart: e, ab:`, 
            // { 
            //     e: args.dragEvent, 
            //     ab: args.baseType,
            //     manifestIndex: args.manifestIndex
            // });

            args.dragEvent.dataTransfer.setData(Constants.DROPTYPE, Constants.BUILD_DROP);
            args.dragEvent.dataTransfer.setData(Constants.BASETYPE, args.baseType as string);
            args.dragEvent.dataTransfer.setData(Constants.MANIFESTINDEX, args.manifestIndex.toString());

            (window as any)[Constants.NOTIFY_BUILD_RESULT_CALLBACK_NAME] = this.handleDropResult.bind(this);
        }

        const allowedBaseMarkup = (args: { forManifestIndex: number }) => {
            return (
                this.props.allowedBasesToBuild.map((allowedBase, idx) => (
                    <span key={this.uiKey()}
                        draggable
                        onDragStart={(e) => dragStartMarkup({ baseType: allowedBase, dragEvent: e, manifestIndex: args.forManifestIndex })}
                        onDragEnd={
                            (e) => {
                                console.log(`BuildManifestComponent: tacticalOptionsMarkup: onDragEnd: e, ab:`,
                                    { e, ab: allowedBase }
                                )
                            }
                        }
                    >
                        {individualAllowedBaseMarkup({ forBaseType: allowedBase as string })}
                    </span>
                )))
        };

        const individualAllowedBaseMarkup = (args: { forBaseType: string }) => {

            const title = `${args.forBaseType} base`;
            const baseTokenSrc = `images/baseTokens/${args.forBaseType}base.png`
            return (<span className="allowedBase" ><img className="selectableBase" src={baseTokenSrc} width="18" height="18" title={title} />{/*args.forBaseType*/}</span>);
        }

        const qtyMessage = () => {
            return (
                this.props.totalAllowedToBuild > 1
                    ? <div>
                        <TickerComponent tickerInterval={20} tickerMessage={`You are allowed to build ${this.props.totalAllowedToBuild} ${this.props.totalAllowedToBuild == 1 ? "base" : "bases"}.`} /></div>
                    : <div>{`You are allowed to build 1 base.`}</div>
            );
        };

        const manifestMarkup = () => {
            return (<ol> {this.state.buildManifest.map((selection, idx) => individualManifestChoiceMarkup(selection, idx))}</ol>)
        }

        const wasBuildError = (selection: buildSelection): boolean => selection.buildResultText !== null && !selection.didBuild;
        
        const individualManifestChoiceMarkup = (selection: buildSelection, idx: number) => {

            return (
                <li key={this.uiKey()}>
                    {
                        selection.didBuild 
                            ? selection.buildResultText 
                            : allowedBaseMarkup({ forManifestIndex: idx })
                    }
                    {
                        wasBuildError(selection)
                            ? " Error: " + selection.buildResultText
                            : null
                    }
                </li>
            );

        }

        const stillBuilding = (): boolean => this.state.buildManifest.filter(m => m.didBuild).length === this.state.buildManifest.length;

        const toRender = (
            <React.Fragment>

                {qtyMessage()} {/* How many are we allowed to build? */}

                {
                    <div>
                        <h5><TickerComponent tickerInterval={25} tickerMessage="Build manifest:" /></h5>
                        {manifestMarkup()}
                    </div>
                }

                {
                    stillBuilding() ? buildManifestCompletedMarkup() : null
                }

            </React.Fragment>
        )

        return toRender;
    }
}
