
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
import { MapItemHoverComponent, hoverListenerFunc } from './MapItemHoverComponent';

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

export interface state {
}

export interface props {
  countryMap: CountryMap;
  playerMapClickListener?: (args: { location: MapLocation }) => void
}

export class MapComponent extends React.Component<props, state> implements GamestateWatcher {

  private uiIdx: number = 0;

  private notifyMapLocationHoveredOver!: hoverListenerFunc;

  constructor(props: props, state: state) {
    super(props, state);

    this.state = {};

    console.log(`MapComponent: Entering with props and state:`, { props: props, state: state });

    GameLogic.registerGamestateWatcher({ watcher: this });

  }

  // This is passed as an argument down to the map item hover component.
  // When it mounts, it invokes this and passes in the hover listener function to invoke when the user hovers their mouse over a map location.
  private registerHoverListener(args: {hoverListener: hoverListenerFunc}) {
    console.log(`MapComponent: hoverListenerRegistrationFunc: Entering with args:`, args);
    this.notifyMapLocationHoveredOver = args.hoverListener;
  }
  
  render() {

    // console.log(`MapComponent.tsx: rendering a map:`, this.props.countryMap);

    const mapRow = (mapRow: MapLocation[]) => {

      const result =
        <tr key={this.uiIdx++}>
          {

            mapRow.map(cell => (

              <td key={this.uiIdx++}
                className="mapCell"
                id={`${this.getMapLocationHtmlID(cell)}`}

                onMouseOver={
                  (e: any) => {
                    console.log(`MapComponent: onMousOver: entering, hover listener:`, this.notifyMapLocationHoveredOver);
                    if (this.notifyMapLocationHoveredOver) {
                      console.log(`MapComponent: onMousOver: notifying listener.`);
                      this.notifyMapLocationHoveredOver({onMapLocation: cell});
                    }
                  }
                }

                onClick={() => {if (this.props.playerMapClickListener) this.props.playerMapClickListener({ location: cell });}}

                onDrop={
                  (e: SyntheticEvent<HTMLTableDataCellElement>) => {
                    e.preventDefault();
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

    const mapAsHtmlTable = () => {

      return (
        <React.Fragment>
          <table className="mapContainer">
            <tbody>
              {this.props.countryMap.map.map(row => mapRow(row))}
            </tbody>
          </table>

          <MapItemHoverComponent registerHoverListener={this.registerHoverListener.bind(this)}/>

        </React.Fragment>
      )
    }

    return (
      <div className="playerMapContainer">
        <MapSummaryComponent mapToSummarize={this.props.countryMap} />
        {mapAsHtmlTable()}
      </div>
    );
  }

  public handleGamestateChange(args: { details: gameStateChangeDetails }) {

    // console.log(`MapComponent: handleGamestateChange: Got a game state change:`, args);

    const { changeLabel } = args.details;

    if (changeLabel === "HighlightMapLocation") {
      this.handleHighlightRequest({forLocation: args.details.relatedLocation as MapLocation});
    }

    if (changeLabel === "DeHighlightMapLocation") {
      this.handleDeHighlightRequest({forLocation: args.details.relatedLocation as MapLocation});
    }

    else if (changeLabel === "Advance Turn") {
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

    else if (args.details.changeLabel === "Base Consumed") {
      console.log("MapComponent: got a base consumed message.");
      this.handleBaseConsumed({baseLocation: args.details.relatedLocation});
    }

    else if (args.details.changeLabel === "ICBM Intercepted" ||
      args.details.changeLabel === "Submarine Missile Shot Down By ABM" ||
      args.details.changeLabel === "Bomber was shot down by ABM" ||
      args.details.changeLabel === "Bomber was shot down by Fighter") {
      this.handleLocationDetargeted({ detargetedLocation: args.details.relatedLocation });
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

  private handleLocationDetargeted(args: { detargetedLocation: MapLocation | undefined }) {
    if (args.detargetedLocation) {
      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.detargetedLocation));

      if (mapLocElement) {
        mapLocElement.classList.remove("targetedMapLocation");
      }
    }
  }

  private handleLocationNuked(args: { nukedLocation: MapLocation | undefined }) {

    // console.log(`MapComponent.ts: handleLocationNuked: Entering, args:`, args);

    if (args.nukedLocation) {

      // console.log(`MapComponent.ts: handleLocationNuked: Got a nuked location OK.`);

      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.nukedLocation));
      // const mapElement = document.getElementById(args.nukedLocation.uniqueID);

      if (mapLocElement) {
        // console.log(`MapComponent.ts: handleLocationNuked: fiddling with nuke classes.`);

        const nukeClasses = ["nukedOnce", "nukedTwice", "nukedThrice"];
        const { nukedLocation } = args;

        mapLocElement.classList.add(nukeClasses[nukedLocation.nuclearStrikes >= 3 ? 2 : nukedLocation.nuclearStrikes - 1]);

        // mapLocElement.classList.add("shake-crazy");
        // mapLocElement.classList.add("shake-freeze");

        this.handleLocationDetargeted({ detargetedLocation: args.nukedLocation });
      }
    }
  }

  private handleBaseConsumed(args: { baseLocation: MapLocation | undefined }) {

    if (args.baseLocation) {

      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.baseLocation));

      if (mapLocElement) {
        mapLocElement.classList.remove("activatedBase");
        mapLocElement.classList.add("consumedBase");
      }
    }
  }

  private handleHighlightRequest(args: {forLocation: MapLocation}) {
    if (args.forLocation) {
      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.forLocation));

      if (mapLocElement) {
        const nukeClasses = ["nukedOnce", "nukedTwice", "nukedThrice"];
        mapLocElement.classList.add(nukeClasses[2]);
      }
    }
  }

  private handleDeHighlightRequest(args: {forLocation: MapLocation}) {
    if (args.forLocation) {
      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.forLocation));

      if (mapLocElement) {
        const nukeClasses = ["nukedOnce", "nukedTwice", "nukedThrice"];
        mapLocElement.classList.remove(nukeClasses[2]);
      }
    }
  }

  private handleLocationDragEvent(args: { doLoc: MapLocation, eventType: "over" | "leave" }) {

    if (args.doLoc) {

      const mapLocElement = document.getElementById(this.getMapLocationHtmlID(args.doLoc));

      if (mapLocElement) {

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
      baseType: args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_BASETYPE),
      manifestIndex: args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_MANIFESTINDEX),
      dropType: args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_DROPTYPE)
    }
    );

    if (args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_DROPTYPE) === Constants.BUILD_DROP) {
      this.handleBuildDrop(args);
      this.forceUpdate();
    }
    else if (args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_DROPTYPE) === Constants.TARGET_MISSILE_DROP) {
      this.handleTargetDrop(args);
    }
    else {
      console.log(`MapComponent: handleDrop: got an unknown drop type:`, args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_DROPTYPE));
    }

  }

  private handleTargetDrop(args: { dropEvent: any, cell: MapLocation }) {

    const notifyDragResultCallack: notifyTargetDragResult = (window as any)[Constants.NOTIFY_TARGET_RESULT_CALLBACK_NAME];

    console.log(`MapComponent.tsx: handleTargetDrop: Got a drop event on a cell:`, {
      event: args.dropEvent,
      cell: args.cell,
      baseType: args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_BASETYPE),
      manifestIndex: args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_MANIFESTINDEX)
    }
    );

    this.handleLocationDragEvent({ doLoc: args.cell, eventType: "leave" }); // clears any class artifact.

    notifyDragResultCallack(
      {
        result: {
          didSucceed: true,
          missileIndex: parseInt(args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_MISSILEINDEX)),
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
      baseType: args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_BASETYPE),
      manifestIndex: args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_MANIFESTINDEX)
    }
    );

    const isOK = args.cell.Contents !== null && GameRules.canPlaceItemAtMapLocation(
      {
        atLocation: args.cell,
        itemToCheck: args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_BASETYPE),
        map: this.props.countryMap
      });

    if (isOK) {

      const newBase = MilitaryBaseFactory.getInstance().createNewBase(
        {
          baseType: (args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_BASETYPE) as MilitaryBaseTypeLabels),
          atLocation: args.cell
        });

      if (newBase) {
        args.cell.placeItem({ itemToPlace: newBase });

        notifyDragResultCallack(
          {
            result: {
              didSucceed: true,
              manifestIndex: parseInt(args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_MANIFESTINDEX)),
              message: `${newBase.WorldObjectLabel} base ${newBase.Name} slated for construction.`
            }
          });

          GameLogic.notifyNewBaseConstructed({forBaseType: newBase});

      }
      else {
        notifyDragResultCallack(
          {
            result: {
              didSucceed: true,
              manifestIndex: parseInt(args.dropEvent.dataTransfer.getData()),
              message: `unknown base type!.`
            }
          });
      }
    }
    else {
      notifyDragResultCallack(
        {
          result: {
            didSucceed: false,
            manifestIndex: parseInt(args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_MANIFESTINDEX)),
            message: `You cannot build the ${args.dropEvent.dataTransfer.getData(Constants.DROPCONSTANTS_BASETYPE)} base at that location. You can only build new bases in rural areas. Navy bases must border the ocean.`
          }
        });
    }

  }

  private getMapLocationHtmlID(forMapLocation: MapLocation) {
    return MapUtil.getMapLocationHtmlID(forMapLocation);
  }

}

