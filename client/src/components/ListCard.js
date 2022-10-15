import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
    @author Rezvan Nafee
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ editActive, setEditActive ] = useState(false);
    store.history = useHistory();
    const { idNamePair, selected } = props;
    const [ text, setText ] = useState(idNamePair.name);

    function handleLoadList(event) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(_id);
        }
    }

    function handleDeleteList(){
        store.markListForDeletion(idNamePair)
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            console.log(id)
            console.log(text)
            store.changeListName(id, text);
            toggleEdit();
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }


    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }

    // Check if the list is currently being editted. 
    let cardStatus = false;
    if (store.listNameActive || store.deleteListPair)  {
        cardStatus = true;
    }
    let cardElement =
        <div
            id={idNamePair._id}
            key={idNamePair._id}
            onClick={handleLoadList}
            className={'list-card ' + selectClass}>
            <span
                id={"list-card-text-" + idNamePair._id}
                key={"span-" + idNamePair._id}
                className="list-card-text">
                {idNamePair.name}
            </span>
            <div className='card-buttons' id = "list-btns">
            <input
                    disabled={cardStatus}
                    type="button"
                    id={"edit-list-" + idNamePair._id}
                    className="list-card-button"
                    onClick={handleToggleEdit}
                    value={"\u270E"}
                />
            <input
                    disabled={cardStatus}
                    type="button"
                    id={"delete-list-" + idNamePair._id}
                    className="list-card-button"
                    onClick = {handleDeleteList}
                    value={"\u2715"}
                />
            </div>
        </div>;

    if (editActive) {
        cardElement =
            <input
                id={"list-" + idNamePair._id}
                className='list-card'
                type='text'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
            />;
    }
    return (
        cardElement
    );
}

export default ListCard;