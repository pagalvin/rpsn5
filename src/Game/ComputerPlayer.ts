import { AbstractPlayer } from "./AbstractPlayer";
import { GameRules } from "./GameRules";
import { GamestateWatcher, gameStateChangeDetails, GameLogic } from "./GameLogic";

export class ComputerPlayer extends AbstractPlayer implements GamestateWatcher {

    constructor() {
        super();
        GameLogic.registerGamestateWatcher({watcher: this});
    }

    public handleGamestateChange(args: { details: gameStateChangeDetails }) {
        // const game: Game = Game.getInstance();

        console.log(`GameHeaderComponent: BuildManifestComponent: Got a game state change.`);

    }

    public playTurn() {

        const availableStrategicChoices = GameRules.getAllowedMoves();

        console.log(`ComputerPlayer: playTurn: my available moves:`, availableStrategicChoices);
 

    }
}