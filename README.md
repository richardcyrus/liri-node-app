# LIRI Bot

* LIRI is a Language Interpretation and Recognition Interface.
* LIRI searches Spotify for songs, Bands in Town for concert events, and OMDB for movies information.

## Specifications

LIRI will accept the following commands:

* `concert-this <band_name>`
* `spotify-this-song <song_name>`
* `movie-this <movie_name>`
* `do-what-it-says`

## Commands

* `concert-this`
    - Search the Bands in Town Artist Event API for the provided artist and return the following information about each event:
        * The venue name.
        * The venue location.
        * The event date in `MM/DD/YYYY` format.
* `spotify-this-song`
    - Using the Spotify API, show the following information about the specified song:
        * The song artist(s).
        * The full song name.
        * A preview link of the song.
        * The album to which the song belongs.
    - If a song is not provided, use the song 'The Sign' by Ace of Base as the default.
* `movie-this`
    - Using the OMDB API, show the following information about the specified movie:
        * The title of the movie.
        * The year the movie was released.
        * The IMDB rating for the movie.
        * The Rotten Tomatoes rating for the movie.
        * The country where the movie was produced.
        * The primary Language of the movie.
        * The movie's plot.
        * The Actors in the movie.
    - If a movie name is not provided, use the movie 'Mr. Nobody' as the default.
* `do-what-it-says`
    - Execute the command(s) provided in the commands.csv file in the application's folder.
    - The format of the `commands.csv` file is:
        
    ```csv
        command,<parameter>
        spotify-this-song,The Sign Ace of Base
    ```
    
    - The file does not contain a header line.
    - There is one command and parameter per line in the file.
