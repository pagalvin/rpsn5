import React, { Component } from 'react';
import { GameHeaderComponent } from "./GameHeaderComponent";
import { UserActionsComponent } from "./UserActionsComponent";
import { GameLogComponent } from "./GameLogComponent";
import { Grid } from '@material-ui/core';
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

        return (
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

                <Grid item xs={8}>
                    Human<br />
                    <MapComponent countryMap={gameEntity.humanPlayer.map} playerMapClickListener={this.playerMapClickListener.bind(this)} />
                </Grid>
                <Grid item xs={4}>
                    <div className="computerMapContainer">
                        Computer<br />
                        <MapComponent countryMap={gameEntity.computerPlayer.map} />
                    </div>
                    <GameLogComponent />
                </Grid>
            </React.Fragment>

        );
    }
}
