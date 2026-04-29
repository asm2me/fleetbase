import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class ChargesNewRoute extends Route {
    @service store;
    model() {
        return this.store.createRecord('trucking-charge', {
            status: 'pending', currency: 'USD', free_days_allowed: 5,
        });
    }
}
