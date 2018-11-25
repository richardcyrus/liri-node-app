/**
 * LIRI Bot.
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus <richard.cyrus@rcyrus.com>.
 */
'use strict';

const winston = require('winston');

// TODO: Validate settings are correct for current version of winston.
// TODO: Add debug file separate from class log file.
const options = {
    file: {
        level: 'debug',
        filename: 'log.txt',
        handleExceptions: true,
        format: winston.format.json()
    },
    console: {
        level: 'info',
        handleExceptions: true,
        format: winston.format.cli({
            colors: {
                error: 'bold red',
                warn: 'bold yellow',
                info: 'green',
                verbose: 'blue',
                debug: 'gray',
                silly: 'white'
            }
        })
    }
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
});

exports.logger = logger;

exports.config = {
    spotify: {
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    },
    omdb: {
        key: process.env.OMDB_KEY,
        url: process.env.OMDB_URL
    },
    bits: {
        key: process.env.BITS_APP_ID,
        url: process.env.BITS_URL
    }
};
