import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
    @author Rezvan Nafee 
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    // Flags to tell us whether or not if things need to be disabled or not
    let disabled = true
    let canUndo = !store.canUndo()
    let canRedo = !store.canRedo()

    // If we have a current list open, the buttons should not be disabled. 
    if (store.currentList)
        disabled = false
    
    // If we have the song that is marked for removal or marked for updating, then that means a modal is active.
    // Since a modal is active, we need to disable the toolbar buttons as well. 
    if (store.updateSongPair || store.removeSongPair){
        // Disabled the add song button and the close list button
        disabled = true
        // Disable the undo button 
        canUndo = true
        // Disable the redo button
        canRedo = true
    }

    function handleUndo() {
        store.undo();
    }

    function handleAdd(){
        console.log("adding song!")
        store.addNewSongTransaction();
    }

    function handleRedo() {
        store.redo();
    }

    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }

    let editStatus = false;

    if (store.isListNameEditActive) {
        editStatus = true;
    }

    return (
        <div id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={disabled}
                value="+"
                className={enabledButtonClass}
                onClick = {handleAdd}
            />
            <input
                type="button"
                id='undo-button'
                disabled={canUndo}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={canRedo}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={disabled}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </div>);
}

export default EditToolbar;