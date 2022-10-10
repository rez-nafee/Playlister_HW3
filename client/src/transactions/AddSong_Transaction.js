import {jsTPS_Transaction} from "../common/jsTPS";

export default class AddSong_Transaction extends jsTPS_Transaction{
    constructor(initStore){
        super();
        this.store = initStore
    }

    doTransaction() {
        this.store.addNewSong()
    }

    undoTransaction() {
        this.store.removeNewAddedSong();
    }
}