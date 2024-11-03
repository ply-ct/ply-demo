import { StepExec, ExecContext, ExecResult, Ply } from '@ply-ct/ply';
import { Movie } from '@ply-ct/ply-movies';

export default class TmdbStep extends StepExec {

    async run(context: ExecContext): Promise<ExecResult> {
        context.values.tmdb = this.getTmdb(context);

        let requestDir = 'test/requests';
        if (context.runOptions?.stepsBase) {
            // means cli from non-root directory -- use rel to stepsBase
            requestDir = `${context.runOptions.stepsBase}/${requestDir}`;
        }
        const request = await new Ply().loadRequest(`${requestDir}/tmdb-discover.ply`);
        const response = await request.submit(context.values);

        const tmdbResults = JSON.parse(response.body).results;
        if (!tmdbResults || tmdbResults.length === 0) {
            return { status: 'Failed', message: 'No results' };
        }

        context.values.tmdb.results = tmdbResults;
        const plyMovies: Movie[] = tmdbResults.map((result: any) => {
            return {
                title: result.original_title,
                year: result.release_date.substring(0, result.release_date.indexOf('-')),
                rating: Math.trunc(result.vote_average / 2) + Math.round(((result.vote_average / 2) % 1) * 2) * 0.5,
                description: result.overview,
                poster: result.poster_path,
                webRef: {
                    site: 'themoviedb.org',
                    ref: result.id
                }
            };
        });
        context.values.plyMovies = plyMovies;

        context.logDebug('plyMovies', plyMovies);

        return { status: 'Passed' };
    }

    getTmdb(context: ExecContext): { [name: string]: any } {
        const tmdb: { [name: string]: any } = {};
        tmdb.key = context.getAttribute('apiKey', { required: true});
        tmdb.year = context.getAttribute('year', { required: true });
        const y = parseInt(tmdb.year);
        if (isNaN(y) || y < 1940) {
            throw new Error('Attribute "year" must be valid year after 1939');
        }

        // optional attributes
        const genre = context.getAttribute('genre');
        if (genre) {
            tmdb.genre = genres[genre];
        }
        const studio = context.getAttribute('studio');
        if (studio) {
            tmdb.studio = studios[studio];
        }
        return tmdb;
    }
}

const genres: { [name: string]: string } = {
    Horror: '27',
    Mystery: '9648'
};

const studios: { [name: string]: string } = {
    'Universal Studios': '33',
    'RKO Radio Pictures': '6',
    'Paramount Pictures': '4'
};

