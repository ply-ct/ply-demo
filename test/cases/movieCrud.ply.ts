import ply, { Suite, Request } from '@ply-ct/ply';
import { suite, test, before, after } from '@ply-ct/ply';
import { assert } from 'chai';

@suite('movie-crud')
export class MovieCrud {

    /**
     * Request suite used by these cases.
     */
    private requestSuite: Suite<Request>;
    private movieId?: string;

    constructor() {
        this.requestSuite = ply.loadSuiteSync('test/requests/movies-api.ply.yaml');
    }

    /**
     * Clean up movie left over from previous test(s) that failed to complete.
     */
    @before
    async beforeAll(values: any) {
        const deleteMovie = this.requestSuite.get('deleteMovie');
        assert.exists(deleteMovie);
        const response = await deleteMovie!.submit({...values, movieId: '435b30ad'});
        this.requestSuite.log.info('Cleanup response status code', response.status.code);
        // response status should either be 200 or 404 (we don't care which during cleanup)
        assert.ok(response.status.code === 200 || response.status.code === 404);
    }

    @test('add new movie')
    async createMovie(values: any) {
        const result = await this.requestSuite.run('createMovie', values);
        values.movieId = result.response?.body?.id;
        assert.strictEqual(result.response?.status?.code, 201);
        assert.exists(result.response?.body);
        // capture movie id from response -- used in downstream values
        this.movieId = result.response?.body?.id;
        this.requestSuite.log.info(`Created movie: id=${this.movieId}`);
    }

    @test('update rating')
    async updateRating(values: any) {
        // update movie rating -- using id returned from createMovie request
        values.id = this.movieId;
        values.rating = 4.5;
        await this.requestSuite.run('updateMovie', values);
        // confirm the update
        await this.requestSuite.run('retrieveMovie', values);
    }

    @test('remove movie')
    async deleteMovie(values: any) {
        // delete movie
        await this.requestSuite.run('deleteMovie', values);
        // confirm the delete
        await this.requestSuite.run('retrieveMovie', values);
    }

    @after
    afterAll() {
    }
}
