import { Game } from "../Entities/gameEntity";

export type strategicMoveOptions = "Build" | "Spy" | "Declare War" | "Skip" | "Activate" | "Sue for Peace" | "Surrender";
export type tacticalMoveOptions = "Build Army Base" | "Build Navy Base" | "Build Air Base" | "Build Missile Base" | "Build Radar Base" | "Build ABM Base" | "Activate";

export interface allowedMoves {
    strategicOptions: strategicMoveOptions[];
    tacticalOptions: tacticalMoveOptions[];
}

export class GameRules {

    public static getAllowedMoves(): allowedMoves {

        const peacetimeStrategicOptions: strategicMoveOptions[] = ["Build", "Spy", "Declare War", "Skip"];
        const warTimeMoveOptions: strategicMoveOptions[] = ["Activate", "Sue for Peace", "Surrender"];
        const pre1962TacticalOptions: tacticalMoveOptions[] = ["Build Army Base", "Build Navy Base", "Build Air Base", "Build Missile Base", "Build Radar Base"];
        const post1962TacticalOptions: tacticalMoveOptions[] = pre1962TacticalOptions.concat("Build ABM Base");
        const warTimeTacticalOptions: tacticalMoveOptions[] = ["Activate"];

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