import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContainersNewController extends Controller {
    @service notifications;
    @service hostRouter;

    containerTypes = ['20ft','40ft','40ft_hc','45ft','reefer','flat_rack','open_top','tank'];
    statuses = ['created','loaded','gated_out','in_transit','at_border','customs_hold','customs_cleared','delivered','returned','empty_returned','scrapped'];

    @action async save(container) {
        try {
            await container.save();
            this.notifications.success('Container saved.');
            this.hostRouter.transitionTo('console.trucking.containers');
        } catch (e) {
            this.notifications.serverError(e);
        }
    }

    @action cancel() {
        this.model.rollbackAttributes();
        this.hostRouter.transitionTo('console.trucking.containers');
    }
}
