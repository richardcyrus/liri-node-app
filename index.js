/**
 * LIRI Bot.
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus <richard.cyrus@rcyrus.com>.
 */
'use strict';

require('dotenv').config();
const { config } = require('./config');
const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .commandDir('commands')
    .demandCommand(1, 'Please choose one of the commands.')
    .strict()
    .help()
    .alias('help', 'h')
    .argv;

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const axios = require('axios');
const Spotify = require('node-spotify-api');
const moment = require('moment');

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
        console.error('The specified command is not valid!');
}

/**
 * Process and run the `do-what-it-says` command.
 *
 * Reads the commands.csv file, one line at a time, and executes the
 * appropriate queries.
 */
function doWhatItSays() {
    const rl = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, 'commands.csv')),
        crlfDelay: Infinity
    });

    rl.on('line', function(line) {
        const [command, value] = line.split(',');

        switch (command) {
            case 'concert-this':
                concertThis(value);
                break;
            case 'spotify-this-song':
                spotifyThisSong(value);
                break;
            case 'movie-this':
                movieThis(value);
                break;
            default:
                console.error('The specified command is not valid!');
        }
    });
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
                return console.error(
                    chalk.red(
                        "\nI'm sorry, the song you requested was not found."
                    )
                );
            }

            data.tracks.items.forEach(function(track) {
                if (track.hasOwnProperty('name')) {
                    console.log(
                        chalk.white('\nSong Name: ') +
                        chalk.cyan(track.name)
                    );
                }
                if (track.hasOwnProperty('artists')) {
                    console.log(
                        chalk.white('Artist(s): ') +
                        chalk.cyan(getSpotifyArtists(track.artists))
                    );
                }
                if (track.hasOwnProperty('album')) {
                    console.log(
                        chalk.white('Album: ') +
                        chalk.cyan(track.album.name)
                    );
                    if (track.album.hasOwnProperty('release_date')) {
                        console.log(
                            chalk.white('Release Date: ') +
                            chalk.cyan(track.album.release_date)
                        );
                    }
                }
                if (track.hasOwnProperty('preview_url')) {
                    console.log(
                        chalk.white('Preview Link: ') +
                        chalk.underline.cyan(track.preview_url)
                    );
                }
                console.log(
                    chalk.yellow(
                        '------------------------------' +
                        '------------------------------' +
                        '--------------------'
                    )
                );
            });
        })
        .catch(function(error) {
            return console.error(error);
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
        method: 'get',
        params: {
            t: movieName,
            type: 'movie',
            r: 'json',
            v: 1,
            plot: 'full',
            apikey: config.omdb.key
        }
    };

    axios.request(query)
        .then(function(response) {
            if (response.status === 200) {
                const movie = response.data;

                if (movie.Response === 'False') {
                    return console.log(
                        chalk.red(`\n${movie.Error}`)
                    );
                }

                if (movie.hasOwnProperty('Title')) {
                    console.log(
                        chalk.white('\nTitle: ') +
                        chalk.blue(movie.Title)
                    );
                }
                if (movie.hasOwnProperty('Released')) {
                    console.log(
                        chalk.white('Released: ') +
                        chalk.blue(movie.Released)
                    );
                }
                if (movie.hasOwnProperty('imdbRating')) {
                    console.log(
                        chalk.white('IMDB Rating: ') +
                        chalk.blue(movie.imdbRating)
                    );
                }
                if (movie.hasOwnProperty('Ratings')) {
                    const rtRating = movie.Ratings.find(function(rating) {
                        return rating.Source === 'Rotten Tomatoes';
                    });

                    if (rtRating.Value) {
                        console.log(
                            chalk.white('Rotten Tomatoes Rating: ') +
                            chalk.blue(rtRating.Value)
                        );
                    }
                }
                if (movie.hasOwnProperty('Country')) {
                    console.log(
                        chalk.white('Production Countries: ') +
                        chalk.blue(movie.Country)
                    );
                }
                if (movie.hasOwnProperty('Language')) {
                    console.log(
                        chalk.white('Language(s): ') +
                        chalk.blue(movie.Language)
                    );
                }
                if (movie.hasOwnProperty('Actors')) {
                    console.log(
                        chalk.white('Actors: ') +
                        chalk.blue(movie.Actors)
                    );
                }
                if (movie.hasOwnProperty('Plot')) {
                    console.log(
                        chalk.white('Plot: ') +
                        chalk.green(movie.Plot)
                    );
                }
                console.log(
                    chalk.yellow(
                        '------------------------------' +
                        '------------------------------' +
                        '--------------------'
                    )
                );
            }
        })
        .catch(function(error) {
            console.error(error);
        });
}

/**
 * Lookup event information with the Bands In Town API based on the
 * name of the artist.
 *
 * @param {string} bandName
 */
function concertThis(bandName) {
    const query = {
        url: `${config.bits.url}${bandName}/events`,
        params: {
            app_id: config.bits.key
        }
    };

    axios
        .all([axios.request(query)])
        .then(axios
            .spread(function(eventResponse) {
                const events = eventResponse.data;

                if (events.errorMessage) {
                    return console.log(
                        chalk.red(`\n${events.errorMessage}`)
                    );
                }

                if (events.length === 0) {
                    return console.log(
                        chalk.magenta(
                            `\nThere are no event dates for ${bandName}`
                        )
                    );
                }

                events.forEach(function(event) {
                    let city = event.venue.city;

                    if (event.venue.region !== '') {
                        city = `${city}, ${event.venue.region}`;
                    }

                    const country = event.venue.country;

                    console.log(
                        chalk.white('\nArtist: ') +
                        chalk.magenta(bandName)
                    );
                    console.log(
                        chalk.white('Concert Date: ') +
                        chalk.magenta(moment(event.datetime)
                            .format('MM/DD/YYYY'))
                    );
                    console.log(
                        chalk.white('Venue: ') +
                        chalk.magenta(event.venue.name)
                    );
                    console.log(
                        chalk.white('Location: ') +
                        chalk.magenta(`${city}, ${country}`)
                    );
                    console.log(
                        chalk.yellow(
                            '------------------------------' +
                            '------------------------------' +
                            '--------------------'
                        )
                    );
                });
            })
        )
        .catch(function(error) {
            console.error(error);
        });
}
