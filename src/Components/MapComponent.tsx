
import React, { Component } from 'react';
import { CountryMap } from '../Entities/WorldObjects/CountryMap';
import { MapLocation } from '../Entities/MapObjects/MapLocation';
import { AbstractMapLocation } from '../Entities/MapObjects/AbstractMapLocation';
import { MapItemComponent } from './MapItemComponent';

export interface state {

}

export interface props {
  countryMap: CountryMap;
}

export class MapComponent extends React.Component<props, state> {

  private uiIdx: number = 0;

  constructor(props: props, state: state) {
    super(props, state);
    this.state = {};
    console.log(`MapComponent: Entering with props and state:`, { props: props, state: state });
  }

  componentDidMount() {

  }

  render() {

    const mapRow = (mapRow: MapLocation[]) => {

      // console.log(`MapComponent: mapRow: got a row to map:`, mapRow);

      const result = 
        <tr key={this.uiIdx++}>
          {
            mapRow.map(cell => <td key={this.uiIdx++}><MapItemComponent mapItem={cell} key={this.uiIdx++}/></td>)
          }

        </tr>
      ;

      const result2 = 
        <div key={this.uiIdx++}>
            mapRow result
        </div>
      ;

      return result;

    }

    const mapTable = () => {

      return (
        <table>
          <tbody>
            {this.props.countryMap.map.map(row => mapRow(row))}
          </tbody>
         </table>
      )
    }

    return (
      <div>
        <h1>Country map</h1>
        {mapTable()}
        <h4>end of country map</h4>
      </div>
    );
  }
}

