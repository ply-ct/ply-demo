import * as ply from '@ply-ct/ply';

export default class AnyBodyStep extends ply.PlyExecBase {

    constructor(
        readonly step: ply.FlowStep,
        readonly instance: ply.StepInstance,
        readonly logger: ply.Logger
    ) {
        super(step, instance, logger);
    }

    async run(_runtime: ply.Runtime, values: any): Promise<ply.ExecResult> {
        const plyRequest = this.step.attributes?.plyRequest;
        if (!plyRequest) {
            throw new Error('Missing attribute: plyRequest');
        }

        const request = await new ply.Ply().loadRequest(plyRequest);
        const response = await request.submit(values);
        if (response.status.code !== 200) {
            return { status: 'Failed', message: `Bad response code: ${response.status.code}` };
        }

        // add to values for use by downstream steps
        const responseValueKey = this.step.attributes?.responseValueKey;
        if (!responseValueKey) {
            throw new Error('Missing attribute: responseValueKey');
        }
        values[responseValueKey] = { ...response, body: JSON.parse(response.body) };
        this.logger.info(`${responseValueKey}: ${JSON.stringify(values[responseValueKey], null, 2)}`);

        return { status: 'Passed' };
    }

}