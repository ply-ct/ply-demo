import * as ply from '@ply-ct/ply';
import { Movie } from '@ply-ct/ply-movies';

export default class TmdbStep extends ply.PlyExecBase {

    constructor(
        readonly step: ply.FlowStep,
        readonly instance: ply.StepInstance,
        readonly logger: ply.Logger
    ) {
        super(step, instance, logger);
    }

    async run(_runtime: ply.Runtime, values: any): Promise<ply.ExecResult> {
        if (!this.step.attributes?.apiKey) {
            throw new Error('Missing attribute: apiKey');
        }
        values.apiKey = this.step.attributes?.apiKey;

        values.tmdb = this.getTmdb(this.step.attributes);

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

        return { status: 'Passed' };
    }

    getTmdb(attributes: { [name: string]: string }): { [name: string]: any } {
        const tmdb: { [name: string]: any } = {};
        if (attributes.year) {
            tmdb.year = attributes.year;
        }
        if (attributes.genre) {
            tmdb.genre = genres[attributes.genre];
        }
        if (attributes.studio) {
            tmdb.studio = studios[attributes.studio];
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

