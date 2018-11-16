import React, { Component } from 'react';
import './App.css';
import { MilitaryBaseFactory } from './Factories/MilitaryBaseFactory';
import { PopulationAreaFactory } from './Factories/PopulationAreaFactory';
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
