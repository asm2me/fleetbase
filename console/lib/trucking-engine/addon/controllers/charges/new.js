import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ChargesNewController extends Controller {
    @service notifications;
    @service hostRouter;

    chargeTypes = ['demurrage','detention','storage','cleaning','damage_repair','customs_penalty','late_return','overweight_penalty','hazmat_surcharge','other'];
    currencies = ['USD','CAD'];
    parties = ['shipper','consignee','carrier','broker','customs'];
    statuses = ['pending','invoiced','paid','disputed','waived','partial_waived'];

    @action async save(charge) {
        try {
            await charge.save();
            this.notifications.success('Charge saved.');
            this.hostRouter.transitionTo('console.trucking.charges');
        } catch (e) { this.notifications.serverError(e); }
    }

    @action cancel() {
        this.model.rollbackAttributes();
        this.hostRouter.transitionTo('console.trucking.charges');
    }
}
