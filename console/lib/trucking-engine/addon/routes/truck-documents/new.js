import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class TruckDocumentsNewRoute extends Route {
    @service store;
    model() { return this.store.createRecord('trucking-truck-document', { status: 'active' }); }
}
