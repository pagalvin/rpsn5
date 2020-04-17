import { ComputerPlayer } from "../Game/ComputerPlayer";
import { HumanPlayer } from "../Game/HumanPlayer";
import { GameLogic } from "../Game/GameLogic";
import { AbstractPlayer } from "../Game/AbstractPlayer";
import { GameData } from "../Data/ComputerNamesFactory";
import { GameRules } from "../Game/GameRules";

export interface GameEntity {
    gameYear: number;
}

export abstract class AbstractGameEntity implements GameEntity {
    abstract gameYear: number;
}

export class Game extends AbstractGameEntity {

    private static instance: Game;

    public isPeacetime: boolean = true;
    public isWartime: boolean = false;
    
    public turn: number = 0;
    public get gameYear() { return this.turn + GameRules.GameStartYear;}
    
    public computerPlayer!: ComputerPlayer;
    public humanPlayer!: HumanPlayer;
    public currentPlayer!: AbstractPlayer;

    private constructor() {
        super();

    }

    private initializeGame() {
        this.computerPlayer = new ComputerPlayer();
        this.computerPlayer.Name = GameData.getRandomComputerPlayerName();
        this.humanPlayer = new HumanPlayer();
        this.currentPlayer = this.humanPlayer;
    }

    public static getInstance() {
        
        if (! this.instance) {
            this.instance = new Game();
            this.instance.initializeGame();
        }

        return this.instance;
    }

    public startGame() {
        
        GameLogic.startClock();
    }
}