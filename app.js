require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', function(req, res) {
  res.render('index')
})

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists.items);
      console.log("IMAGES ARRAY", data.body.artists.items[0].images)
      res.render('artist-search-results', {data: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
});

app.get('/albums/:id', (req, res) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(function(data) {
    // console.log('Artist albums', data.body.items);
    res.render('albums', {albums: data.body.items})
    },
    function(err) {
      console.error(err);
    }
  );
})

app.get('/:id/tracks', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id, { limit : 20, offset : 1 })
  .then(function(data) {
    console.log("TRACKS INFO::",data.body);
    res.render('tracks', {tracks: data.body.items})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
