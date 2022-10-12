/*
    This is where we'll route all of the received http requests
    into controller response functions.

    @author McKilla Gorilla
    @author Rezvan Nafee 
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()

// POST METHODS FOR CREATING NEW DOCUMENTS IN THE DATABASE
router.post('/playlist', PlaylistController.createPlaylist)

// PUT METHODS FOR UPDATING DOCUMENTS IN THE THE DATABASE
router.put('/updatePlaylistName', PlaylistController.updatePlaylistName)
router.put('/addNewSong', PlaylistController.addNewSong)
router.put('/addRemovedSong', PlaylistController.addRemovedSong)
router.put('/updateSong', PlaylistController.updateSong)
router.put('/moveSong', PlaylistController.moveSong) 

// DELETE METHODS FOR REMOVING DOCUMENTS FROM THE DATABASE 
router.delete('/deletePlaylist', PlaylistController.deletePlayliyById)
router.delete('/removeNewSong', PlaylistController.removeNewSong);
router.delete('/removeSong', PlaylistController.removeSong); 

// GET METHODS FOR RETRIEVING DOCUMENTS FROM THE DATABASE
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)

module.exports = router