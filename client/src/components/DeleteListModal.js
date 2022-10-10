import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteListModal(props){

    const {store} = useContext(GlobalStoreContext);

    // FUNCTION TO HANDLE THE USER HITTING THE CONFIRM BUTTON OF THE DELETE LIST MODA 
    function deleteList(){
        store.deleteList();
    }


    // FUNCTION TO HANDLE THE USER HITTING THE CANCEL BUTTON TO CLOSE THE DELETE LIST MODAL
    function hideDeleteListModal(){
        store.closeDeleteListModal();
    }

    // NAME OF THE LIST NAME THAT NEEDS TO BE DELETED 
    var name = ""
    if (store.deleteListPair)
        // IF WE HAVE THE LIST MARKED FOR DELETION, GET THE SONG NAME. 
        name = store.deleteListPair.name

    return (
        <div 
            className="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-delete-list-root'>
                    <div className="modal-north">
                        Delete playlist?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content" id = 'delete-list-modal-center-content'>
                            Are you sure you wish to permanently delete the <span style={{fontWeight : "bold"}}>{name}</span>{'\u00A0'} playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            className="modal-button" 
                            onClick={deleteList}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            className="modal-button" 
                            onClick={hideDeleteListModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteListModal;