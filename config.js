/**
 * LIRI Bot.
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus <richard.cyrus@rcyrus.com>.
 */
'use strict';

exports.config = {
    spotify: {
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    },
    omdb: {
        key: process.env.OMDB_KEY,
        url: process.env.OMDB_URL || 'http://www.omdbapi.com/'
    },
    bits: {
        key: process.env.BITS_APP_ID,
        url: process.env.BITS_URL || 'https://rest.bandsintown.com/artists/'
    }
};
