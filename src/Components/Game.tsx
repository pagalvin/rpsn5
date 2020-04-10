import React, { Component } from 'react';
import { GameHeaderComponent } from "./GameHeaderComponent";
import { UserActionsComponent } from "./UserActionsComponent";
import { GameLogComponent } from "./GameLogComponent";
import { Grid, Paper, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { Game } from '../Entities/gameEntity';
import { MapLocation } from '../Entities/MapObjects/MapLocation';
import { MapComponent } from './MapComponents/MapComponent';
import { BuildVersion } from '../Game/BuildVersion';

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
                    <MapComponent countryMap={gameEntity.humanPlayer.map} playerMapClickListener={this.playerMapClickListener.bind(this)} />
                </Grid>
                <Grid item xs={6}>
                    <div className="xcomputerMapContainer">
                        <MapComponent countryMap={gameEntity.computerPlayer.map} />
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
                        {gameEntity.computerPlayer.Name}<br />
                        <MapComponent countryMap={gameEntity.computerPlayer.map} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <GameLogComponent />
                </Grid>
            </React.Fragment>

        );

        const format3 = () => (
            <Grid container className="gameDefaults gameContainer" alignContent="center">

                <Grid item xs={12}>
                    <GameHeaderComponent />
                </Grid>

                <Grid item xs={4} className="gameUILeftZone">
                    <Grid container alignContent="center">
                        <MapComponent countryMap={gameEntity.humanPlayer.map} playerMapClickListener={this.playerMapClickListener.bind(this)} />
                    </Grid>
                </Grid>
                <Grid item xs={4} className="gameUIMiddleZone">
                    <UserActionsComponent
                        player={gameEntity.humanPlayer}
                        mapClickListener={this.playerMapClickListener.bind(this)}
                        registerMapListener={this.registerMapListener.bind(this)}
                    />
                    <GameLogComponent />
                </Grid>

                <Grid item xs={4} className="gameUIRightZone">
                    <MapComponent countryMap={gameEntity.computerPlayer.map} />
                </Grid>

                <span className="gameBuildInformation">Build version: {BuildVersion.BUILD_VERSION}</span>
            </Grid>

        );


        return format3();
    }
}
