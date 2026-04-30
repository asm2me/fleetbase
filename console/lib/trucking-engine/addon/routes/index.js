import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const DEFAULT_EXPIRY_ALERTS = Object.freeze({
    trucks_expiring: [],
    drivers_expiring: [],
    trucks_expired: [],
    drivers_expired: [],
});

function normalizeExpiryAlerts(response) {
    const data = response?.data ?? response?.result ?? response ?? {};

    return {
        trucks_expiring: Array.isArray(data.trucks_expiring) ? data.trucks_expiring : [],
        drivers_expiring: Array.isArray(data.drivers_expiring) ? data.drivers_expiring : [],
        trucks_expired: Array.isArray(data.trucks_expired) ? data.trucks_expired : [],
        drivers_expired: Array.isArray(data.drivers_expired) ? data.drivers_expired : [],
    };
}

export default class TruckingIndexRoute extends Route {
    @service fetch;

    async model() {
        try {
            const response = await this.fetch.get('/int/v1/trucking/containers/expiry-alerts', { days: 60 });
            return normalizeExpiryAlerts(response);
        } catch {
            return { ...DEFAULT_EXPIRY_ALERTS };
        }
    }
}
