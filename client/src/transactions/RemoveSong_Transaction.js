import {jsTPS_Transaction} from "../common/jsTPS";

export default class RemoveSong_Transaction extends jsTPS_Transaction{
    constructor(initStore, initSong, initPosition){
        super();
        this.store = initStore
        this.song = initSong
        this.position = initPosition
    }

    doTransaction() {
        this.store.removeSong(this.position);
    }

    undoTransaction() {
        this.store.addRemovedSong(this.song,this.position);
    }
}