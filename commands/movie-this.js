/**
 * LIRI Bot.
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus <richard.cyrus@rcyrus.com>.
 */
'use strict';

exports.command = 'movie-this [movieName]';
exports.describe = 'Lookup information about a movie.';
exports.builder = function(yargs) {
    return yargs.positional(
        'movieName', {
            default: 'Mr. Nobody',
            describe: 'The name of a movie.',
            type: 'string',
        });
};
