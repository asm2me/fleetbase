import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TruckDocumentsNewController extends Controller {
    @service notifications;
    @service hostRouter;

    documentTypes = ['usdot_number','mc_number','cvor_number','puc_certificate','cab_card','insurance_cert','oversize_permit','border_crossing_auth','ifta_license','safety_fitness_cert','customs_broker_auth'];
    countries = ['US','CA'];
    statuses = ['active','expired','suspended','revoked','pending_renewal'];

    @action async save(doc) {
        try {
            await doc.save();
            this.notifications.success('Document saved.');
            this.hostRouter.transitionTo('console.trucking.truck-documents');
        } catch (e) { this.notifications.serverError(e); }
    }

    @action cancel() {
        this.model.rollbackAttributes();
        this.hostRouter.transitionTo('console.trucking.truck-documents');
    }
}
