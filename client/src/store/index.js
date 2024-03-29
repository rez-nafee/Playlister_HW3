import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'

import AddSong_Transaction from '../transactions/AddSong_Transaction';
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction';
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
    @author Rezvan Nafee
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_REMOVAL: "MARK_SONG_FOR_REMOVAL",
    MARK_SONG_FOR_UPDATE: "MARK_SONG_FOR_UPDATE",
    CAN_UNDO : "CAN_UNDO",
    CAN_REDO : "CAN_REDO",
    IS_SONG_MODAL_OPEN: "IS_SONG_MODAL_OPEN",
    IS_LIST_DELETE_MODAL_OPEN: "IS_LIST_DELETE_MODAL_OPEN"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        deleteListPair: null,
        removeSongPair: null,
        updateSongPair: null,
        isModalOpen: false,
        canUndo: false, 
        canRedo: false, 
        listNameActive: false,
        tps: tps
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    tps: tps
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    transaction: tps
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    transaction: tps
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: payload.length+1,
                    listNameActive: false,
                    transaction: tps
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    deleteListPair: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    transaction: tps
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    transaction: tps
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: payload,
                    transaction: tps
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_REMOVAL: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    removeSongPair: payload,
                    newListCounter: store.newListCounter,
                    currentList: store.currentList,
                    transaction: tps
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_UPDATE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    updateSongPair: payload,
                    newListCounter: store.newListCounter,
                    currentList: store.currentList,
                    transaction: tps
                });
            }
            case GlobalStoreActionType.CAN_UNDO: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    canUndo: payload,
                    newListCounter: store.newListCounter,
                    currentList: store.currentList,
                    transaction: tps
                });
            }
            case GlobalStoreActionType.CAN_REDO: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    canRedo: payload,
                    newListCounter: store.newListCounter,
                    currentList: store.currentList,
                    transaction: tps
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            console.log(response.data.playlist)
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName
                console.log(api)
                async function updateListName(playlist, newName) {
                    response = await api.updatePlaylistName(playlist._id, newName);
                    console.log(response)
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            console.log("GETTING NEW LIST PAIRS!")
                            response = await api.getPlaylistPairs();
                            console.log(response)
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                console.log(pairsArray)
                                storeReducer({
                                    type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
                                    payload: false
                                });
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateListName(playlist, newName);
            }
        }
        if(newName)
            asyncChangeListName(id);
        else{
            storeReducer({
                type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
                payload: false
            });
        }
    }

    // THIS FUNCTION MARKS THE DELETION OF A LIST & PROMPTS THE CUSTOMER FOR CONFIRMATION
    store.markListForDeletion = function (idNamePair) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: idNamePair
        })
        // MAKE THE MODAL VISIBLE TO DISPLAY TO THE USER
        document.getElementById("delete-list-modal").classList.add("is-visible");
    }

    // THIS FUNCTION CLOSES THE MODAL & HIDES THE MODAL FROM THE CUSTOMER 
    store.closeDeleteListModal = function (){
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: null
        })
        // HIDE THE MODAL FROM THE USER. 
        document.getElementById("delete-list-modal").classList.remove("is-visible");
    }

    // THIS FUNCTION IS FOR DELETEING THE LIST MARKED & HIDES THE MODAL FROM THE USER. 
    store.deleteList = function () {
        async function deleteList (id) {
            console.log("DELETE THE LIST WITH THE FOLLOWING ID: ", id);
            let response = await api.deletePlaylist(id);
            if (response.data.success) {
                console.log("PLAYLIST DELETED SUCESSFULLY!")
                async function asyncLoadIdNamePairs() {
                    console.log("GETTING ID NAME PAIRS")
                    const response = await api.getPlaylistPairs();
                    console.log(response)
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: pairsArray
                        });
                    }
                    else {
                        console.log("NO ID NAME PAIRS FOUND!")
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: []
                        });
                    }
                }
                asyncLoadIdNamePairs();
            }
        }
        deleteList(store.deleteListPair._id);
        // HIDE THE MODAL FROM THE USER. 
        document.getElementById("delete-list-modal").classList.remove("is-visible");
        // UPDATE THE LIST MAKRED FOR DELETION
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: {}
        })
        // CLEAR ALL TRANSACTIONS FROM THE TRANSACTION STACK
        tps.clearAllTransactions();
    }


    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        //CLEAR THE TRANSACTION STACK
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        store.history.push("/")
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray.length)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: []
                });
            }
        }
        asyncLoadIdNamePairs();
    }

    // THIS FUNCTION CREATES A NEW LIST FOR THE USER
    store.createNewList = function (name, songs) {
        async function asyncCreateNewList (name, songs){
            let response = await api.createPlaylist(name, songs);
            console.log("The response is: ", response);
            if(response.data.success){
                console.log ("The playlist is: ", response.data.playlist)
                let playlist = response.data.playlist
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncCreateNewList(name, songs);
    }

    // THIS FUCTION SETS THE CURRENT LIST 
    store.setCurrentList = function (id) {
        //CLEAR THE TRANSACTION STACK 
        tps.clearAllTransactions(); 
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

// FUNCTIONS FOR ADDING, REMOVING, EDITING A SONG

// FUNCTION FOR REMOVING & ADDING A NEW SONG TO THE CURRENT LIST: 
    // THIS IS A FUNCTION FOR ADDING A NEW SONG TO THE CURRENT LIST
    store.addNewSong = function () {
        async function addNewSongToList(id, song){
            console.log("We will be adding a song to a list with an ID of: ", id)
            console.log("Song to add: ", song)
            // SEND A REQUEST OVER TO OUR SERVER
            let response = await api.addNewSong(id,song);
            if(response.data.success){
                // IF WE GET A SUCCESSFUL RESPONSE FROM THE SERVER, THEN WE CAN UPDATE THE CURRENT LIST
                let playlist = response.data.playlist;
                if (response.data.success) {
                    // UPDATE THE CURRENT LIST WITH NEWLY ADDED SONG
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        console.log("Adding a new song to the current list!")
        // CREATE A DEFAULT SONG OBJECT TO BE ADDED TO THE LIST 
        let newSong = {
            title: "Untitled",
            artist: "Unkown",
            youTubeId: "dQw4w9WgXcQ"
        }
        // CALL TO FUNCTION TO UPDATE THE DOCUMENTS IN THE DATABASE
        addNewSongToList(store.currentList._id, newSong); 
    }
    // THIS IS A FUNCTION FOR REMOVING A NEWLY ADDED SONG TO THE LIST
    store.removeNewAddedSong = function () {
        async function removeNewSong (id) {
            // SEND A REQUEST TO OUR SERVER TO REMOVE THE NEWLY ADDED SONG
            let response = await api.removeNewSong(id);
            if(response.data.success){
                // IF THE RESPONSE WAS SUCCESSFUL, THEN WE CAN UPDATE THE CURRENT LIST.
                let playlist = response.data.playlist;
                console.log(playlist)
                if (response.data.success) {
                    //UPDATE THE CURRENT LIST 
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        } 
        console.log("Removing newly adding song...")
        // CALL TO FUNCTION TO UPDATE THE DOCUMENTS IN THE DATABSE
        removeNewSong(store.currentList._id); 
    }
    // THIS IS A FUNCTION FOR FACILITATING THE ADDING AND REMOVAL OF A NEWLY ADDED SONG TO THE LIST 
    store.addNewSongTransaction = function (){
        console.log("Adding new song to list...")
        let transaction = new AddSong_Transaction(this);
        tps.addTransaction(transaction);
    }
// FUNCTION FOR REMOVING & ADDING A SONG TO THE CURRENT LIST: 
    // THIS IS A FUNCTION FOR MARKING A SONG FOR REMOVAL 
    store.markSongForRemoval = function (song,position) {
        let pair = {
            song: song,
            position: position
        } 
        console.log(pair)
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_REMOVAL,
            payload: pair
        });
        // SHOW THE MODAL FOR THE CONFIRMATION OF REMOVING THE SONG. 
        document.getElementById("remove-song-modal").classList.add("is-visible");
    } 
    // THIS FUNCTION FOR HIDING THE REMOVE SONG MODAL. 
    store.closeRemoveSongModal = function (){
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_REMOVAL,
            payload: null
        });
        // HIDE THE MODAL FOR REMOVING THE SONG. 
        document.getElementById("remove-song-modal").classList.remove("is-visible");
    }
    // THIS FUNCTION IS FOR REMOVING THE MARKED SONG FROM THE LIST
    store.removeSong = function (position){
        async function removeSongFromPlaylist(id, position){
            // SEND A REQUEST TO OUR SERVER TO REMOVE THE SONG FROM THE PLAYLIST WITH THE SPECIFIED ID AND POSITION 
            let response = await api.removeSong(id, position);
            if(response.data.success){
                // IF THE RESPONSE WAS SUCCESSFUL, THEN WE CAN UPDATE THE CURRENT LIST.
                let playlist = response.data.playlist;
                console.log(playlist)
                if (response.data.success) {
                    // UPDATE THE REMOVE SONG PAIR
                    storeReducer({
                        type: GlobalStoreActionType.MARK_SONG_FOR_REMOVAL,
                        payload: null
                    });
                    //UPDATE THE CURRENT LIST 
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        removeSongFromPlaylist(store.currentList._id, position)
        // HIDE THE MODAL FOR REMOVING THE SONG. 
        document.getElementById("remove-song-modal").classList.remove("is-visible");
    }
    // THIS IS A FUNCTION FOR ADDING BACK A REMOVED SONG WITH IT'S POSITION AND THE ACTUAL SONG REMOVED 
    store.addRemovedSong = function (song, position){
        async function addRemovedSong (song, position, id){
            let response = await api.addRemovedSong(song,position, id);
            if(response.data.success){
                // IF THE RESPONSE WAS SUCCESSFUL, THEN WE CAN UPDATE THE CURRENT LIST.
                let playlist = response.data.playlist;
                console.log(playlist)
                if (response.data.success) {
                    //UPDATE THE CURRENT LIST 
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            } 
        }
        addRemovedSong(song, position, store.currentList._id)
    }
    // THIS IS A FUNCTION FOR FACILITATING THE ADDING AND REMOVAL OF A SONG TO THE LIST 
    store.removeSongTransaction = function (){
        console.log("Removing song from list...")
        let transaction = new RemoveSong_Transaction(this, store.removeSongPair.song, store.removeSongPair.position);
        tps.addTransaction(transaction);
    }
// FUNCTIONS FOR HANDLING UPDATING THE SONG'S TEXT 
    //THIS IS A FUNCTION THAT MARKS THE SONG THAT THE USER WOULD LIKE TO UPDATE AND PROMPTS THEM WITH THE UPDATE MODAL
    store.markSongForUpdating = function (song, position){
        let pair = {
            song: song,
            position: position
        } 
        console.log(pair)
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_UPDATE,
            payload: pair
        });
        // SHOW THE MODAL FOR THE CONFIRMATION OF UPDATING THE SONG. 
        document.getElementById("update-song-modal").classList.add("is-visible");
        // GRAB THE MODAL'S INPUT FIELDS
        let title = document.getElementById("update-song-input-title")
        let artist = document.getElementById("update-song-input-artist")
        let youTubeId = document.getElementById("update-song-input-youTubeId")
        // SET THE VALUES OF THE INPUTS
        title.value = song.title
        artist.value = song.artist
        youTubeId.value = song.youTubeId
    }
    // THIS IS A FUCNTION FOR CLOSING THE UPDATE SONG MODAL
    store.closeUpdateSongModal = function (){
        // HIDE THE MODAL FOR THE CONFIRMATION OF UPDATING THE SONG. 
        document.getElementById("update-song-modal").classList.remove("is-visible");
        // GRAB THE MODAL'S INPUT FIELDS
        let title = document.getElementById("update-song-input-title")
        let artist = document.getElementById("update-song-input-artist")
        let youTubeId = document.getElementById("update-song-input-youTubeId")
        // SET THE VALUES OF THE INPUTS
        title.value = ""
        artist.value = ""
        youTubeId.value = ""
        // UPDATE THE SONG THAT WAS MARKED FOR UPDATE. 
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_UPDATE,
            payload: null
        });
    }
    // THIS IS A FUNCTION THAT UPDATES THE SONG IN THE CURRENT LIST IN THE DATABSE
    store.updateSong = function (song, position){
        async function updateSong(id, song, position) {
            let response = await api.updateSong(id, song, position)
            if(response.data.success){
                // IF WE GET A SUCCESSFUL RESPONSE FROM THE SERVER, THEN WE CAN UPDATE THE CURRENT LIST
                let playlist = response.data.playlist;
                console.log(playlist)
                if (response.data.success) {
                    // UPDATE THE CURRENT LIST WITH NEWLY ADDED SONG
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        updateSong(store.currentList._id, song, position)
        store.closeUpdateSongModal()
    }

    store.updateSongTransaction = function(newSong) {
        let transaction = new UpdateSong_Transaction(this, store.updateSongPair.song, newSong, store.updateSongPair.position)
        tps.addTransaction(transaction)
    }

// FUNCTION FOR MOVING A SONG BY DRAGGING IT AROUND
    store.moveSongs = function (startPair, endPair) {
        async function moveSong(id, startPair, endPair){
            console.log("Swap start: ", startPair)
            console.log("Swap end: ", endPair)
            let response = await api.moveSong(id, startPair.song, parseInt(startPair.position), endPair.song, parseInt(endPair.position));
            if(response.data.success){
                // IF WE GET A SUCCESSFUL RESPONSE FROM THE SERVER, THEN WE CAN UPDATE THE CURRENT LIST
                let playlist = response.data.playlist;
                console.log(playlist.songs)
                if (response.data.success) {
                    // UPDATE THE CURRENT LIST WITH NEWLY ADDED SONG
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        moveSong(store.currentList._id, startPair, endPair);
    }

    store.moveSongTransaction= function (startIndex, endIndex) {
        let startSongPair = {
            song: store.currentList.songs[startIndex],
            position: startIndex
        }
        let endSongPair = {
            song: store.currentList.songs[endIndex],
            position: endIndex
        }
        console.log("Start Song Pair: ", startSongPair)
        console.log("End Song Pair: ", endSongPair)
        if(startSongPair.position != endSongPair.position){
            console.log("making move song transaction...")
            let transaction = new MoveSong_Transaction(this, startSongPair, endSongPair)
            tps.addTransaction(transaction);
        }
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }

    store.canUndo = function () {
        return tps.hasTransactionToUndo()
    }

    store.canRedo = function () {
        return tps.hasTransactionToRedo()
    }

    store.undo = function () {
        tps.undoTransaction();
    }

    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: true
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}