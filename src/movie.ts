import { StepExec, ExecContext, ExecResult } from '@ply-ct/ply';

export default class NextMovie extends StepExec {

    async run(context: ExecContext): Promise<ExecResult> {
        if (Array.isArray(context.values.plyMovies)) {
            context.values.plyMovie = context.values.plyMovies.pop();
            return { status: 'Passed' };
        } else {
            throw new Error('Expects array value: plyMovies');
        }
    }
}
