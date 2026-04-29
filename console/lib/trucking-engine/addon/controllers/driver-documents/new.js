import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class DriverDocumentsNewController extends Controller {
    @service notifications;
    @service hostRouter;

    documentTypes = [
        'cdl_license','fast_card','nexus_card','passport','medical_certificate',
        'twic_card','h2s_certificate','hazmat_endorsement','commercial_vehicle_operator',
        'drug_alcohol_clearinghouse','annual_review',
    ];
    cdlClasses = ['A','B','C','D'];
    endorsementOptions = ['H','N','P','S','T','X'];
    countries = ['US','CA'];
    statuses = ['active','expired','suspended','revoked','pending_renewal'];

    @action async save(doc) {
        try {
            await doc.save();
            this.notifications.success('Document saved.');
            this.hostRouter.transitionTo('console.trucking.driver-documents');
        } catch (e) { this.notifications.serverError(e); }
    }

    @action cancel() {
        this.model.rollbackAttributes();
        this.hostRouter.transitionTo('console.trucking.driver-documents');
    }

    @action toggleEndorsement(letter) {
        const list = [...(this.model.cdl_endorsements || [])];
        const i = list.indexOf(letter);
        if (i === -1) list.push(letter); else list.splice(i, 1);
        this.model.cdl_endorsements = list;
    }
}
