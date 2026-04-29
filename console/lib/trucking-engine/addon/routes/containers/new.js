import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class ContainersNewRoute extends Route {
    @service store;
    model() { return this.store.createRecord('trucking-container', { status: 'created', free_days: 5, free_days_detention: 5 }); }
}
