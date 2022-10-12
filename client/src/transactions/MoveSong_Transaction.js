import {jsTPS_Transaction} from "../common/jsTPS";

export default class MoveSong_Transaction extends jsTPS_Transaction{
    constructor(initStore, initStartPair, initEndPair){
        super();
        this.store = initStore
        this.moveStartPair = initStartPair
        this.moveEndPair = initEndPair
    }

    doTransaction() {
        this.store.moveSongs(this.moveStartPair, this.moveEndPair);
    }

    undoTransaction() {
        this.store.moveSongs(this.moveEndPair, this.moveStartPair);
    }
}