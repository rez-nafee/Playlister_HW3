import React, {useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;

    function handleRemoveSong() {
        console.log("REMOVING SONG!") 
        store.markSongForRemoval(song,index)
    }

    // DISABLED STATUS FOR THE BUTTON IF THERE IS A SONG THAT IS CURRENTLY BEING UPDATED OR REMOVED
    let disabled = false; 
    if (store.removeSongPair || store.updateSongPair){
        disabled = true;
    }


   const handleClick = (event) => {
    console.log(event.detail);
    switch(event.detail){
        case 1: {
            console.log("clicked on me once")
            break
        }
        case 2: {
            console.log("clicked on me twice")
            store.markSongForUpdating(song,index)
            break
        }
        default:{
            break;
        }
    }
   }

   const handleDragStart = (event) => {
    console.log("Drag started at: ", song)
    event.dataTransfer.setData("drag-start-song", event.target.id)
   }

   const handleDrop = (event) => {
    event.preventDefault()
    console.log("Drag started from: ", event.dataTransfer.getData("drag-start-song").match((/(\d+)/))[0])
    console.log("Drag ended from: ", event.target.id.match((/(\d+)/))[0])
    store.moveSongTransaction(event.dataTransfer.getData("drag-start-song").match((/(\d+)/))[0], event.target.id.match((/(\d+)/))[0])
   }

   const handleDragOver = (event) => {
    event.preventDefault();
   }

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onClick = {handleClick}
            onDragStart = {handleDragStart}
            onDragOver = {handleDragOver}
            onDrop = {handleDrop}
            draggable = {true}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                target="_blank"
                rel="noreferrer"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleRemoveSong}
                disabled = {disabled}
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;