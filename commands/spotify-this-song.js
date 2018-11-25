/**
 * LIRI Bot.
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus <richard.cyrus@rcyrus.com>.
 */
'use strict';

exports.command = 'spotify-this-song [songName]';
exports.describe = 'Lookup information about a song on Spotify.';
exports.builder = function(yargs) {
    return yargs.positional(
        'songName', {
            default: 'The Sign Ace of Base',
            describe: 'The name of the song.',
            type: 'string',
        });
};
