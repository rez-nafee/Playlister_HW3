/*
    This is our http api, which we use to send requests to
    our back-end API. Note we're using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it's a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE'LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /playlist). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export const getAllPlaylists = () => api.get(`/playlists`)
export const getPlaylistPairs = () => api.get('playlistpairs')
export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const createPlaylist = (name, songs) => api.post('/playlist', {name, songs})
export const updatePlaylistName = (id,name) => api.put('/updatePlaylistName', {id, name})
export const deletePlaylist = (id) => api.delete('/deletePlaylist', {data: {id : id}})
export const addNewSong = (id, song) => api.put('/addNewSong', {id,song})
export const removeNewSong = (id) => api.delete('/removeNewSong', {data: {id : id}})
export const removeSong = (id, position) => api.delete('/removeSong', {data: {id : id, position: position}})
export const addRemovedSong = (song,position,id) => api.put('/addRemovedSong', {song,position,id})
export const updateSong  = (id, song, position) => api.put('/updateSong', {id,song,position})
export const moveSong = (id, startSong, startPosition, endSong, endPosition) => api.put('/moveSong', {id,startSong,startPosition,endSong,endPosition})

const apis = {
    getAllPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    createPlaylist,
    updatePlaylistName,
    deletePlaylist,
    addNewSong,
    removeNewSong,
    removeSong,
    addRemovedSong,
    updateSong,
    moveSong
}

export default apis
