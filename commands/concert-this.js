/**
 * LIRI Bot.
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus <richard.cyrus@rcyrus.com>.
 */
'use strict';

exports.command = 'concert-this <bandName>';
exports.describe = 'Lookup concert dates for an artist or band.';
exports.builder = function(yargs) {
    return yargs.positional(
        'bandName', {
            describe: 'The name of a band or artist.',
            type: 'string',
        });
};
