import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default class TruckingContainerModel extends Model {
    @attr('string') public_id;
    @attr('string') container_number;
    @attr('string') container_type;
    @attr('string') booking_number;
    @attr('string') bill_of_lading;
    @attr('string') seal_number;
    @attr('string') shipping_line;
    @attr('string') port_of_loading;
    @attr('string') port_of_discharge;
    @attr('string') final_destination;
    @attr('string') status;
    @attr('number') free_days;
    @attr('number') free_days_detention;
    @attr('number') demurrage_days;
    @attr('number') detention_days;
    @attr('date')   estimated_arrival_at;
    @attr('date')   gate_in_at;
    @attr('date')   gate_out_at;
    @attr('date')   customs_in_at;
    @attr('date')   customs_out_at;
    @attr('date')   delivered_at;
    @attr('date')   returned_at;
    @attr('string') notes;
    @attr()         meta;
    @attr('date')   updated_at;
    @attr('date')   created_at;

    @computed('status')
    get statusBadgeClass() {
        const map = {
            created: 'gray', loaded: 'blue', gated_out: 'indigo',
            in_transit: 'cyan', at_border: 'yellow', customs_hold: 'red',
            customs_cleared: 'green', delivered: 'emerald',
            returned: 'orange', empty_returned: 'slate', scrapped: 'zinc',
        };
        return map[this.status] || 'gray';
    }
}
