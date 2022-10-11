import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function UpdateSongModal(){
    
    const {store} = useContext(GlobalStoreContext);

    function updateSong(){
        var newSong = {
            title: document.getElementById("update-song-input-title").value,
            artist: document.getElementById("update-song-input-artist").value,
            youTubeId: document.getElementById("update-song-input-youTubeId").value
        }
        store.updateSongTransaction(newSong)
    }

    function hideUpdateSongModal (){
        store.closeUpdateSongModal()
    }

    return (
        <>
            <div 
                className="modal" 
                id="update-song-modal" 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-update-song-root'>
                        <div className="modal-north">
                            Edit Song:
                        </div>
                        <div className="modal-center-update-song">
                                <div className='update-song-container'>
                                    <label className='update-song-text'>Title:</label>
                                    <input type="text" className='update-song-input' id="update-song-input-title" name="title"></input>
                                </div>
                                <div className='update-song-container'>
                                    <label className='update-song-text'>Artist:</label>
                                    <input type="text" className='update-song-input' id="update-song-input-artist" name="artist"></input>
                                </div>
                                <div className='update-song-container'>
                                    <label className='update-song-text'>YouTube ID:</label>
                                    <input type="text" className='update-song-input' id="update-song-input-youTubeId" name="youtubeId"></input>
                                </div>
                        </div>
                        <div className="modal-south">
                            <input type="button" 
                                id="update-song-confirm-button" 
                                className="modal-button" 
                                value='Confirm' 
                                onClick={updateSong}
                                />
                            <input type="button" 
                                id="update-song-cancel-button" 
                                className="modal-button"
                                value='Cancel'
                                onClick={hideUpdateSongModal} 
                                />
                        </div>
                    </div>
            </div>
        </>
    )
}
export default UpdateSongModal; 