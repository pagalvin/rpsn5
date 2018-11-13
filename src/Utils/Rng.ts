
export class Rng {

    public static throwDice(args: {hiNumberMinus1: number}) {

        //Math.floor(Math.random() * 10);     // returns a random integer from 0 to 9

        return Math.floor(Math.random() * args.hiNumberMinus1);     

    }

    public static pickRandomFromArray(args: {sourceArray: any[]}) {

        if (! args.sourceArray) throw "Rng.ts: pickRandomFromArray: error, source array is null or undefined.";
        if (args.sourceArray.length === 0) throw "Rng.ts: pickRandomFromArray: error, source array is empty.";

        return (args.sourceArray[this.throwDice({hiNumberMinus1: args.sourceArray.length - 1})]);
        
    }
}