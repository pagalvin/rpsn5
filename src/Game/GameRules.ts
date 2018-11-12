import { Game } from "../Entities/gameEntity";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { MapLocation } from "../Entities/MapObjects/MapLocation";
import { PlaceableObject, PlaceableObjectLabels } from "../Entities/MapObjects/PlaceableObjects";
import { MilitaryBaseTypeLabels } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";

export type strategicMoveOptions = "Build" | "Spy" | "Declare War" | "Skip" | "Activate" | "Sue for Peace" | "Surrender";
export type tacticalMoveOptions = MilitaryBaseTypeLabels | "Activate Base";

export interface allowedMoves {
    strategicOptions: strategicMoveOptions[];
    tacticalOptions: tacticalMoveOptions[];
}

export class GameRules {

    public static canPlaceItemAtMapLocation(args: {map: CountryMap, atLocation: MapLocation, itemToCheck: PlaceableObjectLabels}): boolean {

        if (args.atLocation.Contents) {
            return args.atLocation.Contents.WorldObjectLabel === "Rural";
        }

        return true;
    }


    public static getAllowedMoves(): allowedMoves {

        const peacetimeStrategicOptions: strategicMoveOptions[] = ["Build", "Spy", "Declare War", "Skip"];
        const warTimeMoveOptions: strategicMoveOptions[] = ["Activate", "Sue for Peace", "Surrender"];
        const pre1962TacticalOptions: tacticalMoveOptions[] = ["Army", "Navy", "Air", "Missile", "Radar"];
        const post1962TacticalOptions: tacticalMoveOptions[] = pre1962TacticalOptions.concat("ABM");
        const warTimeTacticalOptions: tacticalMoveOptions[] = ["Activate Base"];

        const game = Game.getInstance();

        const currentPeacetimeTacticalOptions = game.gameYear > 1962 ? post1962TacticalOptions : pre1962TacticalOptions;

        const getPeaceTimeOptions = (): allowedMoves => (
            {
                strategicOptions: peacetimeStrategicOptions,
                tacticalOptions: currentPeacetimeTacticalOptions
            });

        const getWartimeOptions = (): allowedMoves => (
            {
                strategicOptions: warTimeMoveOptions,
                tacticalOptions: warTimeTacticalOptions
            });

        const result = game.isPeacetime ? getPeaceTimeOptions() : getWartimeOptions();

        return result;

    }

}