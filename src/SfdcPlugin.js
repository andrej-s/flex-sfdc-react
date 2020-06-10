import { FlexPlugin } from 'flex-plugin';
import { isSalesForce } from './helpers/salesforce';
import { loadScript } from './helpers/load-script';

const PLUGIN_NAME = 'SfdcPlugin';

export default class SfdcPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  get sfApi() {
    return window.sforce.opencti;
  }
  
  cases = {};
  
  initRecords(identifier) {
    let param = {apexClass: 'TwilioCaseController', methodName: 'createRecords', methodParams: `phone=${identifier}`};
    param.callback = (payload) => {
      let caseId = payload.returnValue.runApex.Id;
      this.cases[identifier] = {caseId: caseId};
      this.logEvent(identifier, 'Reservation accepted', null);
      this.screenPop(caseId);
    }
    this.sfApi.runApex(param);
  }
  
  screenPop(sObjectId) {
    this.sfApi.screenPop({
      type: this.sfApi.SCREENPOP_TYPE.SOBJECT,
      params: { recordId: sObjectId }
    });
  }

  logEvent(identifier, event, pastEvent) {
    let caseInfo = this.cases[identifier];
    let now = Math.round((new Date()).getTime() / 1000);
    caseInfo[event] = { startTime: now };
    let caseId = caseInfo.caseId;
  
    // if there was a logged event before this one, update it with duration
    if(pastEvent) {
      let params = {
        entityApiName: 'TwilioCallLog__c',
        Id: caseInfo[pastEvent].logId,
        Duration__c: now-caseInfo[pastEvent].startTime
      }
      this.sfApi.saveLog({value:params});
    }
  
    // log current event
    let params = {
        entityApiName: 'TwilioCallLog__c',
        Name: `${identifier} - ${event}`,
        Case__c: caseId,
        Status__c: event
    }
    this.sfApi.saveLog({value:params, callback:(payload) => caseInfo[event].logId =  payload.returnValue.recordId});
  }

  
  async init(flex, manager) {
    const sfdcBaseUrl = window.location.ancestorOrigins[0];

    if (!isSalesForce(sfdcBaseUrl)) {
      // Continue as usual
      console.log('Not initializing Salesforce since this instance has been launched independently.');
      return;
    }

    const sfApiUrl = `${sfdcBaseUrl}/support/api/44.0/lightning/opencti_min.js`;
    await loadScript(sfApiUrl);

    if (!window.sforce) {
        console.log('Saleforce cannot be found');
        return;
    }

    // ready for customization
    flex.Actions.on('afterAcceptTask', payload => this.initRecords(payload.task.attributes.name));
    flex.Actions.on('afterHangupCall', payload => this.logEvent(payload.task.attributes.name, 'Wrapup', 'Reservation accepted'));
    flex.Actions.on('afterCompleteTask', payload => this.logEvent(payload.task.attributes.name, 'Completed', 'Wrapup')); 
  }
}