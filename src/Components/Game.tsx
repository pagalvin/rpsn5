import React, { Component } from 'react';
import { GameHeaderComponent } from "./GameHeaderComponent";
import { UserActionsComponent } from "./UserActionsComponent";
import { MapComponent } from "./MapComponent";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { GameLogComponent } from "./GameLogComponent";
import { Grid } from '@material-ui/core';
import { Game } from '../Entities/gameEntity';

export class GameComponent extends Component {

    componentDidMount() {

        const gameEntity = Game.getInstance();

        gameEntity.startGame();
    }

    render() {

        const gameEntity = Game.getInstance();

        return (
            <React.Fragment>
                <Grid item xs={12}>
                    <GameHeaderComponent />
                </Grid>

                <Grid item xs={12}>
                    <UserActionsComponent player={gameEntity.humanPlayer}/>
                </Grid>

                <Grid item xs={8}>
                    Human<br/>
                    <MapComponent countryMap={gameEntity.humanPlayer.map}/>
                </Grid>
                <Grid item xs={4}>
                    <div className="computerMapContainer">
                        Computer<br/>
                        <MapComponent countryMap={gameEntity.computerPlayer.map}/>
                    </div>
                    <GameLogComponent />
                </Grid>
            </React.Fragment>

        );
    }
}
