
import React, { Component, SyntheticEvent } from 'react';
import { CountryMap } from '../../Entities/WorldObjects/CountryMap';
import { MapLocation } from '../../Entities/MapObjects/MapLocation';
import { GameRules } from '../../Game/GameRules';
import { Constants } from '../../Game/constants';
import { MilitaryBaseFactory } from '../../Factories/MilitaryBaseFactory';
import { MilitaryBaseTypeLabels } from '../../Entities/WorldObjects/Bases/MilitaryBaseTypes';
import { GamestateWatcher, gameStateChangeDetails, GameLogic } from '../../Game/GameLogic';
import { MapItemComponent } from './MapItemComponent';
import { MapSummaryComponent } from './MapSummaryComponent';

export interface buildBaseResult {
  manifestIndex: number;
  didSucceed: boolean;
  message: string;
}

export interface targetMissileResult {
  missileIndex: number;
  didSucceed: boolean;
  message: string;
  targetedLocation: MapLocation;
}

export type notifyBuildDragResult = (args: { result: buildBaseResult }) => void;
export type notifyTargetDragResult = (args: { result: targetMissileResult }) => void;

export interface state { }

export interface props {
  countryMap: CountryMap;
  playerMapClickListener?: (args: { location: MapLocation }) => void
}

export class MapComponent extends React.Component<props, state> implements GamestateWatcher {

  private uiIdx: number = 0;

  constructor(props: props, state: state) {
    super(props, state);

    this.state = {};

    console.log(`MapComponent: Entering with props and state:`, { props: props, state: state });

    GameLogic.registerGamestateWatcher({ watcher: this });

  }

  componentDidMount() {

  }

  public handleGamestateChange(args: { details: gameStateChangeDetails }) {

    // console.log(`MapComponent: handleGamestateChange: Got a game state change:`, args);

    if (args.details.changeLabel === "Advance Turn" || args.details.changeLabel === "Map Location Targeted") {
      this.forceUpdate();
    }
  }

  private handleDrop(args: { dropEvent: any /* SyntheticEvent<HTMLTableCellElement>*/, cell: MapLocation }) {

    console.log(`MapComponent.tsx: handleDrop: Got a drop event on a cell:`, {
      event: args.dropEvent,
      cell: args.cell,
      baseType: args.dropEvent.dataTransfer.getData("baseType"),
      manifestIndex: args.dropEvent.dataTransfer.getData("manifestIndex"),
      dropType: args.dropEvent.dataTransfer.getData("dropType")
    }
    );

    if (args.dropEvent.dataTransfer.getData("dropType") === Constants.BUILD_DROP) {
      this.handleBuildDrop(args);
      this.forceUpdate();
    }
    else if (args.dropEvent.dataTransfer.getData("dropType") === Constants.TARGET_MISSILE_DROP) {
      this.handleTargetDrop(args);
    }
    else {
      console.log(`MapComponent: handleDrop: got an unknown drop type:`, args.dropEvent.dataTransfer.getData("dropType"));
    }

  }

  private handleTargetDrop(args: { dropEvent: any, cell: MapLocation }) {

    const notifyDragResultCallack: notifyTargetDragResult = (window as any)[Constants.NOTIFY_TARGET_RESULT_CALLBACK_NAME];
    
    console.log(`MapComponent.tsx: handleTargetDrop: Got a drop event on a cell:`, {
      event: args.dropEvent,
      cell: args.cell,
      baseType: args.dropEvent.dataTransfer.getData("baseType"),
      manifestIndex: args.dropEvent.dataTransfer.getData("manifestIndex")
    }
    );

    notifyDragResultCallack(
      {
        result: {
          didSucceed: true,
          missileIndex: parseInt(args.dropEvent.dataTransfer.getData("missileIndex")),
          message: `Successfully targeted enemy sector ${args.cell.uniqueID}.`,
          targetedLocation: args.cell
        }
      });

  }

  private handleBuildDrop(args: { dropEvent: any, cell: MapLocation }) {

    const notifyDragResultCallack: notifyBuildDragResult = (window as any)[Constants.NOTIFY_BUILD_RESULT_CALLBACK_NAME];

    console.log(`MapComponent.tsx: handleBuildDrop: Got a drop event on a cell:`, {
      event: args.dropEvent,
      cell: args.cell,
      baseType: args.dropEvent.dataTransfer.getData("baseType"),
      manifestIndex: args.dropEvent.dataTransfer.getData("manifestIndex")
    }
    );

    const isOK = args.cell.Contents !== null && GameRules.canPlaceItemAtMapLocation(
      {
        atLocation: args.cell,
        itemToCheck: args.cell.Contents.WorldObjectLabel,
        map: this.props.countryMap
      });

    if (isOK) {

      const newBase = MilitaryBaseFactory.getInstance().createNewBase({ baseType: (args.dropEvent.dataTransfer.getData("baseType") as MilitaryBaseTypeLabels) });

      if (newBase) {
        args.cell.placeItem({ itemToPlace: newBase });

        notifyDragResultCallack(
          {
            result: {
              didSucceed: true,
              manifestIndex: parseInt(args.dropEvent.dataTransfer.getData("manifestIndex")),
              message: `Successfully built a base, type=${newBase.WorldObjectLabel} named ${newBase.Name}.`
            }
          });
      }
      else {
        notifyDragResultCallack(
          {
            result: {
              didSucceed: true,
              manifestIndex: parseInt(args.dropEvent.dataTransfer.getData("manifestIndex")),
              message: `unknown base type!.`
            }
          });
      }
    }
    else {
      console.log(`MapComponent: handleBuildDrop: You can't place an object there because of rules or it's not an empty location.`);
      notifyDragResultCallack(
        {
          result: {
            didSucceed: false,
            manifestIndex: parseInt(args.dropEvent.dataTransfer.getData("manifestIndex")),
            message: "You cannot build a base there because it is already occupied by another base or large population area."
          }
        });
    }

  }

  render() {

    console.log(`MapComponent.tsx: rendering a map:`, this.props.countryMap);

    const mapRow = (mapRow: MapLocation[]) => {

      // console.log(`MapComponent: mapRow: got a row to map:`, mapRow);

      const result =
        <tr key={this.uiIdx++}>
          {
            mapRow.map(cell => (
              <td key={this.uiIdx++}

                onClick={() => {
                  if (this.props.playerMapClickListener) this.props.playerMapClickListener({ location: cell });
                }
                }

                onDrop={
                  (e: SyntheticEvent<HTMLTableDataCellElement>) => {
                    e.preventDefault();
                    console.log(`MapComponent: render: onDrop: e:`, { e: e });
                    this.handleDrop({ dropEvent: e, cell: cell });
                  }
                }
                onDragOver={
                  (e) => {
                    e.preventDefault();
                    // console.log(`MapComponent: render: onDragOver: e:`, { e: e, cell: cell });
                  }
                }
              >
                &nbsp;
                _
                <MapItemComponent mapItem={cell} key={this.uiIdx++} />
                {cell.isTargeted ? <span>[T]</span> : null}
                _
                &nbsp;

              </td>
            ))
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
        <MapSummaryComponent  mapToSummary={this.props.countryMap} />
        {mapTable()}
        <h4>end of country map</h4>
      </div>
    );
  }
}

