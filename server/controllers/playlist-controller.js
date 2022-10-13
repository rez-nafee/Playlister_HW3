const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
    @author Rezvan Nafee 
*/
createPlaylist = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    playlist
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}

updatePlaylistName = async (req, res) => {
    await Playlist.findOne({ _id: req.body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        //UPDATE ThE NAME IN THE DATABASE WITH THE NEW NAME
        list.name = req.body.name

        //CHECK THE NEWLY UPDATE THE PLAYLIST
        console.log(list)
    
        //SAVE THE LIST AND RETURN A RESPONSE WITH THE NEWLY UPDATE PLAYLIST
        list
        .save()
        .then(() => {
            console.log("SAVED THE LIST!")
            return res.status(200).json({
                success: true,
                playlist: list,
                message: 'Playlist Name Updated!',
            })
        })
    }).catch(err => console.log(err))  
}

deletePlaylistyById = async (req,res) => {
    await Playlist.findByIdAndDelete({ _id: req.body.id }, (err,list) => {
        // IF THERE WAS AN ERROR ENCOUNTERED WHILE SEARCHING FOR THE ID, RETURN A BAD RESPONSE. 
        if (err) {
            console.log("COULDN'T DELETE PLAYLIST!")
            return res.status(400).json({
                success: false,
                message: "FAILED: COULDN'T DELETE PLAYLIST."
            })
        }
        // IF THERE WASN'T AN ERROR ENCOUNTERED WHILE SEARCHING FOR THE ID, RETURN A SUCCESSFUL RESPONSE. 
        console.log("PLAYLIST DELETED SUCCESSFULLY!")
        return res.status(200).json({
            success: true,
            playlist: list, 
            message: "SUCESS: DELETED PLAYLIST!",
        })
    }).catch(err => console.log(err)) 
}
 
getPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}

getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}

getPlaylistPairs = async (req, res) => {
    console.log("looking for playlists....")
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ success: false, error: err})
        }
        if (!playlists.length) {
            console.log("no lists found!")
            let pairs = [];
            return res
                .status(204)
                .json({ success: true, idNamePairs: pairs})
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id : list._id,
                    name : list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs})
        }
    }).catch(err => console.log(err))
}

// FUNCTIONS FOR SONGS

// ADDING A NEW SONG TO THE LIST. 
addNewSong = async (req, res) => {
    console.log("Adding new song...")
    await Playlist.findOne({ _id: req.body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // ADD THE NEW SONG TO THE LIST
        list.songs.push(req.body.song)
        // SAVE THE LIST AND RETURN A SUCCESSFUL RESPONSE
        list
        .save()
        .then(() => {
            console.log("ADDED A NEW SONG!")
            return res.status(200).json({
                success: true,
                playlist: list,
                message: 'ADDED A NEW SONG!',
            })
        })
    }).catch(err => console.log(err))
}

// REMOVING THE NEWLY ADDED SONG FROM THE LIST
removeNewSong = async (req,res) => {
    console.log("Removing newly added song...")
    await Playlist.findOne({ _id: req.body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // REMOVE THE NEWLY SONG FROM THE LIST
        list.songs.pop(); 
        // SAVE THE LIST AND RETURN A SUCCESSFUL RESPONSE
        list
        .save()
        .then(() => {
            console.log("REMOVED THE NEWLY ADDED SONG!")
            return res.status(200).json({
                success: true,
                playlist: list,
                message: 'REMOVED THE NEWLY ADDED SONG!',
            })
        })
    }).catch(err => console.log(err))
}

// REMOVING A SONG AT A SPECIFIED POSITION 
removeSong = async (req,res) => {
    console.log("Removing song...")
    await Playlist.findOne({ _id: req.body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // MAKE A COPY OF THE SONGS WE CURRENTLY HAVE IN THE LIST
        var songs = [...list.songs]
        // START AT THE INDEX OF THE SONG THAT NEEDS TO BE REMOVED, AND REMOVE ONE ITEM
        songs.splice(req.body.position,1)
        // UPDATE THE SONGS WITHIN THE LIST 
        list.songs = songs
        // SAVE THE LIST AND RETURN A SUCCESSFUL RESPONSE
        list
        .save()
        .then(() => {
            console.log("REMOVED SPECIFIED SONG!")
            return res.status(200).json({
                success: true,
                playlist: list,
                message: "REMOVED SPECIFIED SONG!",
            })
        })
    }).catch(err => console.log(err))
}
// FUNCTION FOR ADDING BACK A REMOVED SONG AT A SPECIFIED POSITION
addRemovedSong = async (req, res) => {
    console.log("Adding removed song...")
    await Playlist.findOne({ _id: req.body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // MAKE A COPY OF THE SONGS WE CURRENTLY HAVE IN THE LIST
        var songs = [...list.songs]
        // START AT THE SPECIFIED INDEX, REMOVE NOTHING, AND ADD ONE SONG! 
        songs.splice(req.body.position,0,req.body.song)
        // UPDATE THE SONGS WITHIN THE LIST 
        list.songs = songs
        // SAVE THE LIST AND RETURN A SUCCESSFUL RESPONSE
        list
        .save()
        .then(() => {
            console.log("ADDED REMOVED SONG!")
            return res.status(200).json({
                success: true,
                playlist: list,
                message: "ADDED REMOVED SONG!",
            })
        })
    }).catch(err => console.log(err))
}

updateSong = async (req, res) => {
    console.log("Updating song...")
    await Playlist.findOne({ _id: req.body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // MAKE A COPY OF THE SONGS WE CURRENTLY HAVE IN THE LIST
        var songs = [...list.songs]
        // START AT THE SPECIFIED INDEX, REMOVE THE SONG, AND ADD ONE SONG! 
        songs.splice(req.body.position,1,req.body.song)
        // UPDATE THE SONGS WITHIN THE LIST 
        list.songs = songs
        // SAVE THE LIST AND RETURN A SUCCESSFUL RESPONSE
        list
        .save()
        .then(() => {
            console.log("UPDATED THE SONG!")
            return res.status(200).json({
                success: true,
                playlist: list,
                message: "UPDATED THE SONG!",
            })
        })
    }).catch(err => console.log(err))
}

moveSong = async (req, res) => {
    console.log("Moving Song...")
    console.log("Start Song: ", req.body.startSong.title)
    console.log("End Song: ", req.body.endSong.title)
    console.log(req.body)
    await Playlist.findOne({ _id: req.body.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // MAKE A COPY OF THE SONGS WE CURRENTLY HAVE IN THE LIST
        var songs = [...list.songs]
        var start = req.body.startPosition
        var end = req.body.endPosition
        if (start < end) {
            let temp = songs[start];
            for (let i = start; i < end; i++) {
                songs[i] = songs[i + 1];
            }
            songs[end] = temp;
        }
        else if (start > end) {
            let temp = songs[start];
            for (let i = start; i > end; i--) {
                songs[i] = songs[i - 1];
            }
            songs[end] = temp;
        }
        list.songs = songs
        // SAVE THE LIST AND RETURN A SUCCESSFUL RESPONSE
        list
        .save()
        .then(() => {
            console.log("MOVED THE SONG!")
            return res.status(200).json({
                success: true,
                playlist: list,
                message: "MOVED THE SONG!",
            })
        })
    }).catch(err => console.log(err))
} 


module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    updatePlaylistName,
    deletePlaylistyById,
    addNewSong,
    removeNewSong,
    removeSong,
    addRemovedSong,
    updateSong,
    moveSong
}