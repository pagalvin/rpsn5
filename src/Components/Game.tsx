import React, { Component } from 'react';
import { GameHeaderComponent } from "./GameHeaderComponent";
import { UserActionsComponent } from "./UserActionsComponent";
import { MapComponent } from "./MapComponent";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { GameLogComponent } from "./GameLogComponent";
import { Grid } from '@material-ui/core';

export class GameComponent extends Component {

    render() {

        return (
            <React.Fragment>
                <Grid item xs={12}>
                    <GameHeaderComponent />
                </Grid>

                <Grid item xs={12}>
                    <UserActionsComponent />
                </Grid>

                <Grid item xs={8}>
                    <MapComponent countryMap={new CountryMap({ sizeX: 10, sizeY: 10 })} />
                </Grid>
                <Grid item xs={4}>
                    <MapComponent countryMap={new CountryMap({ sizeX: 10, sizeY: 10 })} />
                    <GameLogComponent />
                </Grid>
            </React.Fragment>

        );
    }
}
