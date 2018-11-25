/**
 * LIRI Bot.
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus <richard.cyrus@rcyrus.com>.
 */
'use strict';

require('dotenv').config();
const { logger, config } = require('./config');
const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .commandDir('commands')
    .demandCommand(1, 'Please choose one of the commands.')
    .strict()
    .help()
    .argv;

const fs = require('fs');
const path = require('path');
const request = require('request');
const Spotify = require('node-spotify-api');
const moment = require('moment');

// TODO: Wrap in function and generalize so doWhatItSays() can use this.
switch (argv._[0]) {
    case 'concert-this':
        concertThis(argv.bandName);
        break;
    case 'spotify-this-song':
        spotifyThisSong(argv.songName);
        break;
    case 'movie-this':
        movieThis(argv.movieName);
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
        logger.error('Invalid command!');
}

// TODO: Error handling for bad artists/bands.
function concertThis(bandName) {
    const eventData = [];

    const query = {
        url: `${config.bits.url}${bandName}/events`,
        qs: {
            app_id: config.bits.key
        }
    };

    request.get(query, function(error, response, body) {
        if (error) {
            throw new Error(error);
        }

        if (response.statusCode === 200) {
            const events = JSON.parse(body);

            // TODO: Validate each property is in the result.
            events.forEach(function(event) {
                eventData.push({
                    name: event.venue.name,
                    country: event.venue.country,
                    region: event.venue.region,
                    city: event.venue.city,
                    date: event.datetime
                });
            });
        }

        logger.debug(eventData);
    });
}

// TODO: Error handling for bad songs+artists.
function spotifyThisSong(songName) {
    const query = {
        type: 'track',
        limit: 1,
        query: songName
    };

    const spotify = new Spotify({
        id: config.spotify.id,
        secret: config.spotify.secret
    });

    // TODO: Validate properties are in the result and return required items.
    spotify.search(query)
        .then(function(data) {
            logger.debug(data.tracks);
        })
        .catch(function(error) {
            return logger.error(error);
        });
}

// TODO: Error handling for bad Movie names.
function movieThis(movieName) {
    const query = {
        url: config.omdb.url,
        qs: {
            t: movieName,
            type: 'movie',
            r: 'json',
            v: 1,
            plot: 'full',
            apikey: config.omdb.key
        }
    };

    request.get(query, function(error, response, body) {
        if (error) {
            throw new Error(error);
        }

        if (response.statusCode === 200) {
            const movie = JSON.parse(body);

            // TODO: Handle no ratings.
            const rtRating = movie.Ratings.find(function(rating) {
                return rating.Source === 'Rotten Tomatoes';
            });

            // TODO: Validate each property is in the result.
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

            logger.info(movieData);
        }
    });
}

// TODO: Handle bad file format.
function doWhatItSays() {
    const stream = fs.createReadStream(path.join(__dirname, 'commands.csv'));

    stream.on('data', function(data) {
        data.toString().split('\n')
            .forEach(function(line) {
                const [operation, parameter] = line.split(',');

                // TODO: Return with reason for ABORT.
                if (!operation || parameter === 'undefined') {
                    return;
                }

                switch (operation) {
                    case 'concert-this':
                        concertThis(parameter);
                        break;
                    case 'spotify-this-song':
                        spotifyThisSong(parameter);
                        break;
                    case 'movie-this':
                        movieThis(parameter);
                        break;
                    default:
                        throw new Error('The specified command is not valid!');
                }
            });
    });

    stream.on('error', function(error) {
        return logger.error(error);
    });
}
