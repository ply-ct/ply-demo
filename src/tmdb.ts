import * as ply from '@ply-ct/ply';

export default class TmdbStep extends ply.PlyExecBase {

    constructor(
        readonly step: ply.FlowStep,
        readonly instance: ply.StepInstance,
        readonly logger: ply.Logger
    ) {
        super(step, instance, logger);
    }

    async run(runtime: ply.Runtime, values: any): Promise<ply.ExecResult> {

        console.log("ATTRIBUTES: " + JSON.stringify(this.step.attributes, null, 2));


        const name = values.name || 'World';
        this.logger.info(`Hello, ${name} from step ${this.step.name} in flow ${runtime.suitePath}`);
        return { status: 'Passed' };
    }
}