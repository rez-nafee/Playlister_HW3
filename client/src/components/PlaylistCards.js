import { useContext, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import { GlobalStoreContext } from '../store'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
    @author Rezvan Nafee
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    console.log(store)

    const handleKeyPress = useCallback((event) => {
        if(event.key.toString().toLowerCase() === 'z' && (event.ctrlKey || event.metaKey)){
            store.undo()
        }
        if(event.key.toString().toLowerCase() === 'y' && (event.ctrlKey || event.metaKey)){
            store.redo()
        }
    }) 

    useEffect(() => {
        // Add the event listener to the document
        document.addEventListener('keydown', handleKeyPress)

        // Remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])

    // Check if we currently have a current list
    if(!store.currentList){
        store.history.push("/")
        return <></>
    }

    return (
        <div id="playlist-cards">
        {
            store.currentList.songs.map((song, index) => (
                <SongCard
                    id={'playlist-song-' + (index)}
                    key={'playlist-song-' + (index)}
                    index={index}
                    song={song}
                />
            ))
        }
        </div>
    )
}

export default PlaylistCards;