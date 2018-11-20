
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
import { MapUtil } from '../../Utils/MapUtils';
import { Table, TableBody, TableCell } from '@material-ui/core';

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

    const { changeLabel } = args.details;

    if (changeLabel === "Advance Turn") {
      this.forceUpdate();
    }

    else if (changeLabel === "Map Location Targeted") {
      this.handleLocationTargeted({ targetedLocation: args.details.relatedLocation });
    }

    else if (changeLabel === "Base Activated") {

      console.log(`MapComponent.tsx: handleGameStateChange: got a Base Activate updated, details:`, args);

      const { relatedBase } = args.details;

      if (relatedBase) {
        this.handleBaseActivated({ nukedLocation: relatedBase.myMapLocation })
      }
    }
    else if (args.details.changeLabel === "Location Nuked") {
      this.handleLocationNuked({ nukedLocation: args.details.relatedLocation });
    }

  }

  private handleBaseActivated(args: { nukedLocation: MapLocation | undefined }) {
    if (args.nukedLocation) {
      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.nukedLocation));

      if (mapLocElement) {
        mapLocElement.classList.add("activatedBase");
      }
    }
  }

  private handleLocationTargeted(args: { targetedLocation: MapLocation | undefined }) {
    if (args.targetedLocation) {
      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.targetedLocation));

      if (mapLocElement) {
        mapLocElement.classList.add("targetedMapLocation");
      }
    }
  }

  private handleLocationNuked(args: { nukedLocation: MapLocation | undefined }) {

    console.log(`MapComponent.ts: handleLocationNuked: Entering, args:`, args);

    if (args.nukedLocation) {

      console.log(`MapComponent.ts: handleLocationNuked: Got a nuked location OK.`);

      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.nukedLocation));

      if (mapLocElement) {
        console.log(`MapComponent.ts: handleLocationNuked: fiddling with nuke classes.`);

        const nukeClasses = ["nukedOnce", "nukedTwice", "nukedThrice"];
        const { nukedLocation } = args;

        mapLocElement.classList.add(nukeClasses[nukedLocation.nuclearStrikes >= 3 ? 2 : nukedLocation.nuclearStrikes - 1]);
      }
    }
  }

  private handleLocationDragEvent(args: { doLoc: MapLocation, eventType: "over" | "leave" }) {

    console.log(`MapComponent.ts: handleLocationDraggedOver: Entering, args:`, args);

    if (args.doLoc) {

      console.log(`MapComponent.ts: handleLocationDraggedOver: Got a nuked location OK.`);

      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.doLoc));

      if (mapLocElement) {
        console.log(`MapComponent.ts: handleLocationDraggedOver: fiddling with nuke classes.`);

        if (args.eventType === "over") {
          mapLocElement.classList.add("mapLocationDraggedOver");
        }
        else {
          mapLocElement.classList.remove("mapLocationDraggedOver");
        }

      }
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

    this.handleLocationDragEvent({doLoc: args.cell, eventType: "leave"}); // clears any class artifact.
    
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

      const newBase = MilitaryBaseFactory.getInstance().createNewBase(
        {
          baseType: (args.dropEvent.dataTransfer.getData("baseType") as MilitaryBaseTypeLabels),
          atLocation: args.cell
        });

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

  private getMapLocationHtmlID(forMapLocation: MapLocation) {
    return MapUtil.getMapLocationHtmlID(forMapLocation);
  }

  render() {

    // console.log(`MapComponent.tsx: rendering a map:`, this.props.countryMap);

    const mapRow = (mapRow: MapLocation[]) => {

      // console.log(`MapComponent: mapRow: got a row to map:`, mapRow);

      //   const nuclearDamageIndicator = (args: {ml: MapLocation}) => {
      //     const {nuclearStrikes} = args.ml;

      //     if (nuclearStrikes === 1) return "nukedOnce";
      //     if (nuclearStrikes === 2) return "nukedTwice"
      //     if (nuclearStrikes === 3) return "nukedThrice";

      //     return "";

      // }

      const result =
        <tr key={this.uiIdx++}>
          {

            mapRow.map(cell => (
              <td key={this.uiIdx++}
                className="mapCell"
                id={`${this.getMapLocationHtmlID(cell)}`}
                // className={nuclearDamageIndicator({ml: cell})}

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

                onDragLeave={
                  (e: any) => {
                    this.handleLocationDragEvent({ doLoc: cell, eventType: "leave" });
                    e.preventDefault();
                  }
                }

                onDragOver={
                  (e: any) => {
                    this.handleLocationDragEvent({ doLoc: cell, eventType: "over" });
                    e.preventDefault();
                    // console.log(`MapComponent: render: onDragOver: e:`, { e: e, cell: cell });
                  }
                }
              >

                <MapItemComponent mapItem={cell} key={this.uiIdx++} />
                {cell.isTargeted ? <span>[T]</span> : null}
              </td>
            ))
          }

        </tr>
        ;

      return result;

    }

    const mapAsMaterialUITable = () => {
      return (
        <Table className="mapContainer" padding="dense">
          <TableBody>
            {this.props.countryMap.map.map(row => mapRow(row))}
          </TableBody>
        </Table>
      )
    }

    const mapAsHtmlTable = () => {

      return (
        <table className="mapContainer">
          <tbody>
            {this.props.countryMap.map.map(row => mapRow(row))}
          </tbody>
        </table>
      )
    }

    return (
      <div>
        <MapSummaryComponent mapToSummarize={this.props.countryMap} />
        {mapAsHtmlTable()}
        {/* {mapAsMaterialUITable()} */}
      </div>
    );
  }
}

