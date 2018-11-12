
import { Game } from "../Entities/gameEntity";

export type gameStateChangeType = "Advance Turn" | "no change"

export interface gameStateChangeDetails {
    changeLabel: gameStateChangeType;
}

export interface GamestateWatcher {
    handleGamestateChange: (args: {details: gameStateChangeDetails}) => void;
}


export class GameLogic {

    private static gameStateWatchers: GamestateWatcher[] = [];

    public static registerGamestateWatcher(args: {watcher: GamestateWatcher}) {
        this.gameStateWatchers = this.gameStateWatchers.concat(args.watcher);
    }

    private static notifyGamestateChange(args: {details: gameStateChangeDetails}) {

        console.log(`GameLogic: notifyGamestateChange(): notifying watchers:`, {watchers: this.gameStateWatchers});

        this.gameStateWatchers.forEach(gsw => gsw.handleGamestateChange({details: args.details}));
    }

    public static playComputerTurn(): void {

        const game = Game.getInstance();

        game.computerPlayer.playTurn();

    }

    public static finishHumanTurn(): void {
        this.playComputerTurn();
        this.advanceTurn();
    }
    
    public static advanceTurn(): void {

        const game = Game.getInstance();

        game.turn++;

        console.log(`GameLogic.ts: advanceTurn: new game turn / year:`, {turn: game.turn, year: game.gameYear});

        this.notifyGamestateChange({details: {changeLabel: "Advance Turn"}});

        return;

    }
}