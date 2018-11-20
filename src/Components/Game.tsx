import React, { Component } from 'react';
import { GameHeaderComponent } from "./GameHeaderComponent";
import { UserActionsComponent } from "./UserActionsComponent";
import { GameLogComponent } from "./GameLogComponent";
import { Grid, Paper } from '@material-ui/core';
import { Game } from '../Entities/gameEntity';
import { MapLocation } from '../Entities/MapObjects/MapLocation';
import { MapComponent } from './MapComponents/MapComponent';

export interface playerMapClickListener {
    handlePlayerMapClick: (args: { location: MapLocation }) => void;
}

export class GameComponent extends Component {

    componentDidMount() {

        const gameEntity = Game.getInstance();

        gameEntity.startGame();
    }

    private userActionsComponent: UserActionsComponent | null = null;

    private registerMapListener(args: { forUserComponent: UserActionsComponent }) {
        this.userActionsComponent = args.forUserComponent;
    }

    private playerMapClickListener(args: { location: MapLocation }) {
        console.log(`Game.tsx: playerMapClickListener: player clicked on a map location:`, args.location);

        if (this.userActionsComponent) { this.userActionsComponent.handlePlayerMapClick(args) }
    }

    render() {

        const gameEntity = Game.getInstance();

        const format1 = () => (
            <React.Fragment>
                <Grid item xs={12}>
                    <GameHeaderComponent />
                </Grid>

                <Grid item xs={12}>
                    <UserActionsComponent
                        player={gameEntity.humanPlayer}
                        mapClickListener={this.playerMapClickListener.bind(this)}
                        registerMapListener={this.registerMapListener.bind(this)}
                    />
                </Grid>

                <Grid item xs={6}>
                    <Paper>
                        Human<br />
                        <MapComponent countryMap={gameEntity.humanPlayer.map} playerMapClickListener={this.playerMapClickListener.bind(this)} />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <div className="xcomputerMapContainer">
                        <Paper>
                            Computer<br />
                            <MapComponent countryMap={gameEntity.computerPlayer.map} />
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <GameLogComponent />
                </Grid>
            </React.Fragment>

        );

        const format2 = () => (
            <React.Fragment>
                <Grid item xs={12}>
                    <GameHeaderComponent />
                </Grid>

                <Grid item xs={4}>
                    <Paper>
                        Human<br />
                        <MapComponent countryMap={gameEntity.humanPlayer.map} playerMapClickListener={this.playerMapClickListener.bind(this)} />
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <UserActionsComponent
                        player={gameEntity.humanPlayer}
                        mapClickListener={this.playerMapClickListener.bind(this)}
                        registerMapListener={this.registerMapListener.bind(this)}
                    />
                </Grid>

                <Grid item xs={4}>
                    <Paper>
                        Computer<br />
                        <MapComponent countryMap={gameEntity.computerPlayer.map} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <GameLogComponent />
                </Grid>
            </React.Fragment>

        );

        return format2();
    }
}
