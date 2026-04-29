import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default class TruckingChargeModel extends Model {
    @attr('string') public_id;
    @attr('string') container_uuid;
    @attr('string') charge_type;
    @attr('string') party_responsible;
    @attr('date')   charge_start_date;
    @attr('date')   charge_end_date;
    @attr('number') free_days_allowed;
    @attr('number') billable_days;
    @attr('number') rate_per_day;
    @attr('number') amount;
    @attr('string') currency;
    @attr('string') status;
    @attr('string') invoice_number;
    @attr('date')   invoice_date;
    @attr('date')   due_date;
    @attr('date')   paid_date;
    @attr('number') amount_paid;
    @attr('number') balance_due;
    @attr('boolean') is_overdue;
    @attr('string')  dispute_reason;
    @attr('string')  notes;
    @attr()          meta;
    @attr('date')    updated_at;
    @attr('date')    created_at;

    @computed('status')
    get statusBadgeClass() {
        const map = {
            pending: 'yellow', invoiced: 'blue', paid: 'green',
            disputed: 'red', waived: 'gray', partial_waived: 'orange',
        };
        return map[this.status] || 'gray';
    }
}
