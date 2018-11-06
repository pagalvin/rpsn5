export interface GameEntity {
}

export abstract class AbstractGameEntity implements GameEntity {

}

export class Game {

    private static instance: Game;

    public turn: number = 0;

    private constructor() {

    }

    public static getInstance() {
        if (! this.instance) {
            this.instance = new Game();
        }

        return this.instance;
    }

}