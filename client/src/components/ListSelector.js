import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
/*
    This React component lists all the playlists in the UI.
    
    @author McKilla Gorilla
    @author Rezvan Nafee
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        console.log(store.newListCounter);
        var name = "Untitled " + store.newListCounter
        var songs = [] 
        store.createNewList(name, songs);
    }
    let listCard = "";
    if (store) {
        listCard = store.idNamePairs.sort((a,b) => a.name.localeCompare(b.name, undefined , {numeric: true, sensitivity: 'base'}))
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
    }

    // Check if the list is currently being editted. 
    let cardStatus = false;
    console.log(store)
    if (store.listNameActive) {
        console.log("A LIST IS BEING EDITTED!")
        cardStatus = true;
    }

    // Check if there is a list that is currently being marked for deletion
    if (store.deleteListPair){
        cardStatus = true;
    }

    return (
        <div id="playlist-selector">
            <div id="playlist-selector-heading">
            <input
                    type="button"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                    className="playlister-button"
                    disabled = {cardStatus}
                    value="+" />
                    &nbsp;Your Lists
            </div> 
            <div id="list-selector-list">{
                    listCard
                }
            </div>
        </div>)
}

export default ListSelector;