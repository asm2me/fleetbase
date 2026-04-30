import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class DriverDocumentsNewRoute extends Route {
    @service store;
    model() { return this.store.createRecord('trucking-driver-document', { status: 'active', cdl_endorsements: [] }); }
}
