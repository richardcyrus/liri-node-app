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
const chalk = require('chalk');

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

/**
 * Return the artist names from a Spotify track look-up.
 *
 * @param {Object} artists
 * @returns {string}
 */
function getSpotifyArtists(artists) {
    const names = [];

    artists.forEach(function(artist) {
        names.push(artist.name);
    });

    if (!names.length > 0) {
        return '';
    }

    return names.join(', ');
}

/**
 * Lookup a song with the spotify API.
 *
 * @param {string} songName
 */
function spotifyThisSong(songName) {
    const spotify = new Spotify({
        id: config.spotify.id,
        secret: config.spotify.secret
    });

    const parameters = {
        type: 'track',
        limit: 1,
        query: songName
    };

    spotify
        .search(parameters)
        .then(function(data) {
            if (!data.tracks.total > 0) {
                return console.log(
                    chalk.red(
                        "I'm sorry, the song you requested was not found."
                    )
                );
            }

            data.tracks.items.forEach(function(track) {
                if (track.hasOwnProperty('name')) {
                    console.log(
                        chalk.white('Song Name: ') +
                        chalk.yellow(track.name)
                    );
                }
                if (track.hasOwnProperty('artists')) {
                    console.log(
                        chalk.white('Artist(s): ') +
                        chalk.yellow(getSpotifyArtists(track.artists))
                    );
                }
                if (track.hasOwnProperty('album')) {
                    console.log(
                        chalk.white('Album: ') +
                        chalk.yellow(track.album.name)
                    );
                    if (track.album.hasOwnProperty('release_date')) {
                        console.log(
                            chalk.white('Release Date: ') +
                            chalk.yellow(track.album.release_date)
                        );
                    }
                }
                if (track.hasOwnProperty('preview_url')) {
                    console.log(
                        chalk.white('Preview Link: ') +
                        chalk.underline.blue(track.preview_url)
                    );
                }
            });
        })
        .catch(function(error) {
            return logger.error(error);
        });
}

/**
 * Lookup a movie with the OMDB API.
 *
 * @param {string} movieName
 */
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

            if (movie.Response === 'False') {
                return console.log(
                    chalk.red(movie.Error)
                );
            }

            if (movie.hasOwnProperty('Title')) {
                console.log(
                    chalk.white('Title: ') +
                    chalk.yellow(movie.Title)
                );
            }
            if (movie.hasOwnProperty('Released')) {
                console.log(
                    chalk.white('Released Year: ') +
                    chalk.yellow(movie.Released)
                );
            }
            if (movie.hasOwnProperty('imdbRating')) {
                console.log(
                    chalk.white('IMDB Rating: ') +
                    chalk.yellow(movie.imdbRating)
                );
            }
            if (movie.hasOwnProperty('Country')) {
                console.log(
                    chalk.white('Production Countries: ') +
                    chalk.yellow(movie.Country)
                );
            }
            if (movie.hasOwnProperty('Language')) {
                console.log(
                    chalk.white('Language(s): ') +
                    chalk.yellow(movie.Language)
                );
            }
            if (movie.hasOwnProperty('Actors')) {
                console.log(
                    chalk.white('Actors: ') +
                    chalk.yellow(movie.Actors)
                );
            }
            if (movie.hasOwnProperty('Ratings')) {
                const rtRating = movie.Ratings.find(function(rating) {
                    return rating.Source === 'Rotten Tomatoes';
                });

                if (rtRating.Value) {
                    console.log(
                        chalk.white('Rotten Tomatoes Rating: ') +
                        chalk.yellow(rtRating.Value)
                    );
                }
            }
            if (movie.hasOwnProperty('Plot')) {
                console.log(
                    chalk.white('Plot: ') +
                    chalk.yellow(movie.Plot)
                );
            }
        }
    });
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

// TODO: Handle bad file format.
function doWhatItSays() {
    const stream = fs.createReadStream(path.join(__dirname, 'commands.csv'));

    stream.on('data', function(data) {
        data
            .toString()
            .split('\n')
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
