#!/usr/bin/env node
/**
 * LIRI Bot.
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus <richard.cyrus@rcyrus.com>.
 */
'use strict';

require('dotenv').config();
const settings = require('./config');
const request = require('request');
const Spotify = require('node-spotify-api');
// const moment = require('moment');
const fs = require('fs');

function spotifyThisSong (songName) {
    const query = {
        type: 'track',
        limit: 1,
        query: songName
    };

    const spotify = new Spotify({
        id: settings.config.spotify.id,
        secret: settings.config.spotify.secret
    });

    spotify.search(query)
        .then(function (data) {
            console.log(data.tracks);
        })
        .catch(function (error) {
            return console.error(error);
        });
}

function concertThis (bandName) {
    let eventData = [];

    /* venue name, venue location, event date */
    const queryUrl = `${settings.config.bits.url}${bandName}/events?app_id=${settings.config.bits.key}`;

    request.get(queryUrl, function (error, response, body) {
        if (error) {
            throw new Error(error);
        }

        if (response.statusCode === 200) {
            const events = JSON.parse(body);
            // console.log(events);

            events.forEach(function (event) {
                eventData.push({
                    name: event.venue.name,
                    country: event.venue.country,
                    region: event.venue.region,
                    city: event.venue.city,
                    date: event.datetime
                });
            });
        }

        console.log(eventData);
    });
}

function movieThis (movieName) {
    const query = {
        url: settings.config.omdb.url,
        qs: {
            t: movieName,
            type: 'movie',
            r: 'json',
            v: 1,
            plot: 'full',
            apikey: settings.config.omdb.key
        }
    };

    request.get(query, function (error, response, body) {
        if (error) {
            throw new Error(error);
        }

        if (response.statusCode === 200) {
            const movie = JSON.parse(body);

            const rtRating = movie.Ratings.find(function (rating) {
                return rating.Source === 'Rotten Tomatoes';
            });

            const movieData = {
                'Title': movie.Title,
                'Released': movie.Released,
                'IMDB Rating': movie.imdbRating,
                'Country': movie.Country,
                'Language': movie.Language,
                'Plot': movie.Plot,
                'Actors': movie.Actors,
                'Rotten Tomatoes Rating': rtRating.Value
            };

            console.log(movieData);
        }
    });
}

function executeWhatItSays (command, parameter) {
    if (!command || parameter === 'undefined') {
        return;
    }

    switch (command) {
        case 'concert-this':
            console.log(`Running ${command} with band name "${parameter}"`);
            break;
        case 'spotify-this-song':
            console.log(`Running ${command} with song name "${parameter}"`);
            break;
        case 'movie-this':
            console.log(`Running ${command} with movie name "${parameter}"`);
            break;
        default:
            throw new Error('The specified command is not valid!');
    }
}

function doWhatItSays () {
    const stream = fs.createReadStream('commands.csv');

    stream.on('data', function (data) {
        data.toString().split('\n')
            .forEach(function (line) {
                let operation;
                let parameter;
                [operation, parameter] = line.split(',');
                executeWhatItSays(operation, parameter);
            });
    });
    stream.on('error', function (error) {
        console.error(error);
        return false;
    });
}

// doWhatItSays();
// concertThis('P!nk');
// movieThis('Mr. Nobody');
spotifyThisSong('The Sign Ace of Base');
