import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TruckingIndexRoute extends Route {
    @service fetch;

    async model() {
        try {
            return await this.fetch.get('/int/v1/trucking/containers/expiry-alerts', { days: 60 });
        } catch {
            return { trucks_expiring: [], drivers_expiring: [], trucks_expired: [], drivers_expired: [] };
        }
    }
}
