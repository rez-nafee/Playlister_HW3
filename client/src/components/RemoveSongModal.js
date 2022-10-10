import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function RemoveSongModal(){

    const {store} = useContext(GlobalStoreContext);

    // NAME OF THE SONG THAT NEEDS TO BE REMOVED 
    var songName = ""
    if (store.removeSongPair)
        // IF WE HAVE THE SONG MARKED FOR REMOVAL, SET THE VARIABLE TO THE NAME OF THE SONG.
        songName = store.removeSongPair.song.title

    // IF THE USER SELECTS CONFIRM, REMOVE THE SONG FROM THE LIST. 
    function handleRemoveSong () {
        console.log("Removing song....")
        store.removeSongTransaction();
    }

    // IF THE USER SELECTS CANCEL, HIDE THE REMOVE SONG MODAL.
    function hideRemoveSongModal() {
        store.closeRemoveSongModal();
    }

    return(
        <>
            <div 
                className="modal" 
                id="remove-song-modal" 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-remove-song-root'>
                        <div className="modal-north">
                            Remove Song?
                        </div>
                        <div className="modal-center">
                            <div className="modal-center-content" id = 'remove-song-modal-center-content'>
                                Are you sure you wish to permanently remove <span style={{fontWeight : "bold"}}>{songName}</span>{'\u00A0'}from the playlist?
                            </div>
                        </div>
                        <div className="modal-south">
                            <input type="button" 
                                id="remove-song-confirm-button" 
                                className="modal-button" 
                                value='Confirm' 
                                onClick={handleRemoveSong}
                                />
                            <input type="button" 
                                id="remove-song-cancel-button" 
                                className="modal-button"
                                value='Cancel'
                                onClick={hideRemoveSongModal} 
                                />
                        </div>
                    </div>
            </div>
        </>
    );
}

export default RemoveSongModal; 