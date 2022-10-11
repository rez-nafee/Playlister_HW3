import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;

    function handleRemoveSong() {
        console.log("REMOVING SONG!") 
        store.markSongForRemoval(song,index)
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

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onClick = {handleClick}
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
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;