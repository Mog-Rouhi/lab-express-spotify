require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/', (req, res, next) => {
    res.render("home");
})


app.get("/artist-search-results", (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
   res.render("artists", {artists: data.body.artists.items, artist: req.query.artist})
   //res.send(data.body)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})



app.get('/albums/:id', (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi.getArtistAlbums(req.params.id)
  .then((data) => {
    //console.log('Artist albums', data.body);
    res.render("albums", {albums: data.body.items, artist: req.query.artist})
  }, function(err) {
    console.error(err);
  });
});


app.get('/tracks/:id', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.id)
  .then(function(data) {
    //console.log(data.body);
    res.render("tracks", {tracks: data.body.items, album: req.query.album, artist: req.query.artist})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})


app.listen(3008, () => console.log('My Spotify project running on port 3008 🎧 🥁 🎸 🔊'));
