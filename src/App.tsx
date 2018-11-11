import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { MilitaryBaseFactory } from './Factories/MilitaryBaseFactory';
import { PopulationAreaFactory } from './Factories/PopulationAreaFactory';
import { CountryMap } from './Entities/WorldObjects/CountryMap';
import { MapComponent } from './Components/MapComponent';
import { City } from './Entities/WorldObjects/PopulationCenters/City';
import { AbmBase } from './Entities/WorldObjects/Bases/AbmBase';
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

    const map = new CountryMap({sizeX: 10, sizeY: 10});

    map.map[0][0].placeItem({itemToPlace: new City({name: "Paul Town", population: 100000})});
    map.map[2][2].placeItem({itemToPlace: new MajorTown({name: "Paul Town", population: 100000})});
    map.map[3][3].placeItem({itemToPlace: new RuralArea({name: "Paul Town", population: 100000})});
    map.map[4][4].placeItem({itemToPlace: new MissileBase()});
    map.map[5][5].placeItem({itemToPlace: new ArmyBase()});
    map.map[6][6].placeItem({itemToPlace: new NavyBase()});
    map.map[7][7].placeItem({itemToPlace: new AirBase()});
    map.map[8][8].placeItem({itemToPlace: new RadarBase()});
    
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header> */}

        <MapComponent countryMap={map} />
      
      </div>
    );
  }
}

export default App;
