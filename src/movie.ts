import * as ply from '@ply-ct/ply';

export default class NextMovie extends ply.PlyExecBase {

    constructor(
        readonly step: ply.FlowStep,
        readonly instance: ply.StepInstance,
        readonly logger: ply.Log
    ) {
        super(step, instance, logger);
    }

    async run(_runtime: ply.Runtime, values: ply.Values): Promise<ply.ExecResult> {
        if (Array.isArray(values.plyMovies)) {
            values.plyMovie = values.plyMovies.pop();
            return { status: 'Passed' };
        } else {
            throw new Error('Expects array value: plyMovies');
        }
    }
}
