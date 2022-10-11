import {jsTPS_Transaction} from "../common/jsTPS";

export default class UpdateSong_Transaction extends jsTPS_Transaction{
    constructor(initStore, initOldSong, initNewSong, initPosition){
        super();
        this.store = initStore
        this.oldSong = initOldSong
        this.newSong = initNewSong
        this.position = initPosition
    }

    doTransaction() {
        this.store.updateSong(this.newSong, this.position)
    }

    undoTransaction() {
        this.store.updateSong(this.oldSong, this.position)
    }
}