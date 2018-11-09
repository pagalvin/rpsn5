export interface GameEntity {
    gameYear: number;
}

export abstract class AbstractGameEntity implements GameEntity {
    abstract gameYear: number;
}

export class Game extends AbstractGameEntity {

    private static instance: Game;

    public turn: number = 0;
    public get gameYear() { return this.turn + 1944;}
    
    private constructor() {
        super();
    }

    public static getInstance() {
        if (! this.instance) {
            this.instance = new Game();
        }

        return this.instance;
    }

}