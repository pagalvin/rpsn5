import { Game } from "../Entities/gameEntity";
import { CountryMap } from "../Entities/WorldObjects/CountryMap";
import { MapLocation } from "../Entities/MapObjects/MapLocation";
import { PlaceableObjectLabels } from "../Entities/MapObjects/PlaceableObjects";
import { MilitaryBaseTypeLabels } from "../Entities/WorldObjects/Bases/MilitaryBaseTypes";
import { Ordnance } from "../Entities/Ordnance";
import { Constants } from "./constants";
import { Rng } from "../Utils/Rng";

export type strategicMoveOptions = "Build" | "Spy" | "Declare War" | "Skip" | "Activate" | "Sue for Peace" | "Surrender";
export type tacticalMoveOptions = MilitaryBaseTypeLabels | "Activate Base";

export interface allowedMoves {
    strategicOptions: strategicMoveOptions[];
    tacticalOptions: tacticalMoveOptions[];
}

export interface nuclearStrikeDamage {
    populationKilled: number;
    strikeCount: number; // max of 3
    attackingOrdnance: Ordnance;
}

export class GameRules {

    public static canPlaceItemAtMapLocation(args: { map: CountryMap, atLocation: MapLocation, itemToCheck: PlaceableObjectLabels }): boolean {

        if (args.atLocation.Contents) {
            return args.atLocation.Contents.WorldObjectLabel === "Rural";
        }

        return true;
    }

    public static getMissileArrivalTicks() {
        const rNbr = Rng.throwDice({hiNumberMinus1: 99});
        if (rNbr < 33) return 1;
        if (rNbr < 85) return 2;
        return 3;
    }

    public static getTotalBasesAllowedToBuild(args: { basedOnStrategicChoice: strategicMoveOptions | null }): number {

        if (args.basedOnStrategicChoice === "Build") return 2;
        if (args.basedOnStrategicChoice === "Spy") return 1;

        return 0;
    }

    public static getNuclearStrikePopulationKilled(args: { onMapLocation: MapLocation }): number {

        const popStrikePctLookup: number[] = [Constants.FIRST_STRIKE_POPULATION_HIT_PCT, Constants.SECOND_STRIKE_POPULATION_HIT_PCT, Constants.THIRD_STRIKE_POPULATION_HIT_PCT];
        const popKilled = args.onMapLocation.Contents ? args.onMapLocation.Contents.Population * popStrikePctLookup[args.onMapLocation.nuclearStrikes -1] : 0;

        return popKilled;
    }

    public static getAllowedMoves(): allowedMoves {

        const peacetimeStrategicOptions: strategicMoveOptions[] = ["Build", "Spy", "Declare War", "Skip"];
        const warTimeMoveOptions: strategicMoveOptions[] = ["Activate", "Sue for Peace", "Surrender"];
        const pre1962TacticalOptions: tacticalMoveOptions[] = ["Army", "Navy", "Air", "Missile", "Radar", "ABM"];
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

    public static getLocationDamage(args: { attackedBy: Ordnance, locationAttacked: MapLocation }): nuclearStrikeDamage {

        const result: nuclearStrikeDamage = {
            strikeCount: args.locationAttacked.nuclearStrikes < 3 ? args.locationAttacked.nuclearStrikes += 1 : 3,
            populationKilled: this.getNuclearStrikePopulationKilled({onMapLocation: args.locationAttacked}),
            attackingOrdnance: args.attackedBy
        }

        return result;

    }
}