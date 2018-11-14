
import { Game } from "../Entities/gameEntity";
import { AbstractPlayer } from "./AbstractPlayer";

export type gameStateChangeType =
    "Advance Turn" |
    "no change" |
    "War Declared" |
    "Computer Playing Its Turn" |
    "Computer Finished Its Turn" |
    "Tick";

export interface gameStateChangeDetails {
    changeLabel: gameStateChangeType;
}

export interface GamestateWatcher {
    handleGamestateChange: (args: { details: gameStateChangeDetails }) => void;
}



export class GameLogic {

    private static gameStateWatchers: GamestateWatcher[] = [];

    public static registerGamestateWatcher(args: { watcher: GamestateWatcher }) {
        this.gameStateWatchers = this.gameStateWatchers.concat(args.watcher);
    }

    private static notifyGamestateChange(args: { details: gameStateChangeDetails }) {

        console.log(`GameLogic: notifyGamestateChange(): notifying watchers:`, { watchers: this.gameStateWatchers });

        this.gameStateWatchers.forEach(gsw => gsw.handleGamestateChange({ details: args.details }));
    }

    public static playComputerTurn(): void {

        const game = Game.getInstance();

        this.notifyGamestateChange({ details: { changeLabel: "Computer Playing Its Turn" } })

        game.computerPlayer.playTurn();

        // this.notifyGamestateChange({details: {changeLabel: "Advance Turn"}});

    }

    public static startClock() {

        let isSleeping: boolean = false;
        const oneSecond = 1000;

        setInterval(() => {

            if (isSleeping) {
                // do nothing
            }
            else {

                const timeout = 3000; // 3 seconds

                isSleeping = true;

                setTimeout(() => {
                    console.log(`GameLogic.ts: startClock: broadcasting a game tick.`);
                    GameLogic.pulseClock();
                    isSleeping = false;
                }, timeout);
            }

        }, oneSecond);

    }

    private static pulseClock() {
        this.notifyGamestateChange({ details: { changeLabel: "Tick" } });
    }

    public static declareWar(args: { declaringPlayer: AbstractPlayer }) {
        console.log(`GameLogic.ts: declareWar: A player declared war:`, { declaringPlayer: args.declaringPlayer });
        args.declaringPlayer.declaredWar = true; // Gives a first-strike bonus but world opinion takes a huge hit

        Game.getInstance().isPeacetime = false;
        Game.getInstance().isWartime = false;

        this.notifyGamestateChange({ details: { changeLabel: "War Declared" } });
    }


    public static finishHumanTurn(): void {
        this.playComputerTurn();
    }

    public static finishComputerTurn(): void {
        this.notifyGamestateChange({ details: { changeLabel: "Advance Turn" } });
    }

    public static advanceTurn(): void {

        const game = Game.getInstance();

        game.turn++;

        console.log(`GameLogic.ts: advanceTurn: new game turn / year:`, { turn: game.turn, year: game.gameYear });

        this.notifyGamestateChange({ details: { changeLabel: "Advance Turn" } });

        return;

    }
}