import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class TruckDocumentsIndexRoute extends Route {
    @service store;
    queryParams = {
        page: { refreshModel: true }, limit: { refreshModel: true },
        sort: { refreshModel: true }, query: { refreshModel: true },
        status: { refreshModel: true }, document_type: { refreshModel: true },
    };
    model(params) { return this.store.query('trucking-truck-document', { ...params }); }
}
