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

// DELETE METHODS FOR REMOVING DOCUMENTS FROM THE DATABASE 
router.delete('/deletePlaylist', PlaylistController.deletePlayliyById)

// GET METHODS FOR RETRIEVING DOCUMENTS FROM THE DATABASE
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)

module.exports = router