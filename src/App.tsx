import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { MilitaryBaseFactory } from './Factories/MilitaryBaseFactory';
import { PopulationAreaFactory } from './Factories/PopulationAreaFactory';
import { CountryMap } from './Entities/WorldObjects/CountryMap';
import { MapComponent } from './Components/MapComponent';
import { City } from './Entities/WorldObjects/PopulationCenters/City';
import { MajorTown } from './Entities/WorldObjects/PopulationCenters/MajorTown';
import { RuralArea } from './Entities/WorldObjects/PopulationCenters/Rural';
import { MissileBase } from './Entities/WorldObjects/Bases/MissleBase';
import { ArmyBase } from './Entities/WorldObjects/Bases/ArmyBase';
import { NavyBase } from './Entities/WorldObjects/Bases/NavyBase';
import { AirBase } from './Entities/WorldObjects/Bases/AirBase';
import { RadarBase } from './Entities/WorldObjects/Bases/RadarBase';
import { GameComponent } from './Components/Game';
import { Grid } from '@material-ui/core';

class App extends Component {

  componentDidMount() {
    const x = MilitaryBaseFactory.getInstance();
    const y = x.createNewBase({ baseType: "ABM" })
    const a1 = PopulationAreaFactory.getInstance().createNewPopulationArea({ popAreaType: "City" })
    const a2 = PopulationAreaFactory.getInstance().createNewPopulationArea({ popAreaType: "Town" })
    const a3 = PopulationAreaFactory.getInstance().createNewPopulationArea({ popAreaType: "Rural" })

    console.log(`App.tsx: componentDidMount: created some pop centers:`,
      {
        pop1: a1,
        pop2: a2,
        pop3: a3
      });

    // map.logDetailedMapToConsole();

  }

  render() {

    return (
      <Grid container><GameComponent/></Grid>
    );

  }
}

export default App;
