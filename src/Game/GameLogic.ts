
import { Game } from "../Entities/gameEntity";

export type gameStateChangeType = 
    "Advance Turn" | 
    "no change" | 
    "Computer Playing Its Turn" |
    "Computer Finished Its Turn" ;

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

        this.notifyGamestateChange({details: {changeLabel: "Computer Playing Its Turn"}})
     
        game.computerPlayer.playTurn();

        // this.notifyGamestateChange({details: {changeLabel: "Advance Turn"}});

    }

    public static finishHumanTurn(): void {
        this.playComputerTurn();
    }
    
    public static finishComputerTurn(): void {
        this.notifyGamestateChange({details: {changeLabel: "Advance Turn"}});
    }

    public static advanceTurn(): void {

        const game = Game.getInstance();

        game.turn++;

        console.log(`GameLogic.ts: advanceTurn: new game turn / year:`, {turn: game.turn, year: game.gameYear});

        this.notifyGamestateChange({details: {changeLabel: "Advance Turn"}});

        return;

    }
}