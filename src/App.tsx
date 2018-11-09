import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { MilitaryBaseFactory } from './Factories/MilitaryBaseFactory';
import { PopulationAreaFactory } from './Factories/PopulationAreaFactory';
import { CountryMap } from './Entities/WorldObjects/WorldMap';

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

    const map = new CountryMap({sizeX: 10, sizeY: 10});

    map.logMapToConsole();
    
    console.log(`App.tsx: componentDidMount: new map:`, map);
    console.table(map);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
