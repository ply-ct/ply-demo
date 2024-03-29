import * as ply from '@ply-ct/ply';

export default class Greeting extends ply.PlyExecBase {

    constructor(
        readonly step: ply.FlowStep,
        readonly instance: ply.StepInstance,
        readonly logger: ply.Log
    ) {
        super(step, instance, logger);
    }

    async run(runtime: ply.Runtime, values: ply.Values): Promise<ply.ExecResult> {
        const name = values.name || 'World';
        this.logger.info(`Hello, ${name} from step ${this.step.name} in flow ${runtime.suitePath}`);
        return { status: 'Passed' };
    }
}