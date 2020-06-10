import { loadScript } from './helpers';

export class SalesForceIntegration {

    get sfApi() {
        return window.sforce.opencti;
    }

    constructor(flex, manager, sfdcBaseUrl) {
        this.flex = flex;
        this.manager = manager;
        this.sfApiUrl = `${sfdcBaseUrl}/support/api/44.0/lightning/opencti_min.js`;
    }

    async init() {
        await loadScript(this.sfApiUrl);

        if (!window.sforce) {
            console.log('Saleforce cannot be found');
            return;
        }

        this.flex.Actions.on('afterTaskAccepted', payload => this.createPopCase(payload.task.attributes.name));
    }

    createPopCase(identifier) {
        let param = {apexClass: 'TwilioCaseController', methodName: 'createCase', methodParams: `phone=${identifier}`};
        param.callback = (payload) => screenPop(payload.returnValue.runApex.Id);
        let apexResult = this.sfApi.runApex(param)
        console.log(apexResult);
    }

    screenPop(sObjectId) {
        this.sfApi.screenPop({
            type: this.sfApi.SCREENPOP_TYPE.SOBJECT,
            params: { recordId: sObjectId }
        });
    }
}