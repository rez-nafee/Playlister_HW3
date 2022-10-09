/*
    This is where we'll route all of the received http requests
    into controller response functions.

    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()

// POST METHODS FOR UPDATING THE DOCUMENTS IN THE DATABASE
router.post('/playlist', PlaylistController.createPlaylist)
router.post('/updatePlaylistName', PlaylistController.updatePlaylistName)

// GET METHODS FOR RETRIEVING INFO FROM THE DATABASE
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)

module.exports = router