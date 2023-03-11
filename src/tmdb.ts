import * as ply from '@ply-ct/ply';
import { Movie } from '@ply-ct/ply-movies';

export default class TmdbStep extends ply.PlyExecBase {

    constructor(
        readonly step: ply.FlowStep,
        readonly instance: ply.StepInstance,
        readonly logger: ply.Log
    ) {
        super(step, instance, logger);
    }

    async run(_runtime: ply.Runtime, values: any, runOptions?: ply.RunOptions): Promise<ply.ExecResult> {
        values.tmdb = this.getTmdb(values, runOptions?.trusted);

        const request = await new ply.Ply().loadRequest('test/requests/tmdb-discover.ply');
        const response = await request.submit(values);

        const tmdbResults = JSON.parse(response.body).results;
        if (!tmdbResults || tmdbResults.length === 0) {
            return { status: 'Failed', message: 'No results' };
        }

        values.tmdb.results = tmdbResults;
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
        values.plyMovies = plyMovies;

        this.logger.debug('plyMovies', plyMovies);

        return { status: 'Passed' };
    }

    getTmdb(values: any, trusted?: boolean): { [name: string]: any } {
        const tmdb: { [name: string]: any } = {};
        tmdb.key = this.getAttribute('apiKey', values, {trusted, required: true});
        tmdb.year = this.getAttribute('year', values, { trusted, required: true });
        const y = parseInt(tmdb.year);
        if (isNaN(y) || y < 1940) {
            throw new Error('Attribute "year" must be valid year after 1939');
        }

        // optional attributes
        const genre = this.getAttribute('genre', values, { trusted });
        if (genre) {
            tmdb.genre = genres[genre];
        }
        const studio = this.getAttribute('studio', values, { trusted });
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

