import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default class TruckingDriverDocumentModel extends Model {
    @attr('string') public_id;
    @attr('string') driver_uuid;
    @attr('string') document_type;
    @attr('string') document_number;
    @attr('string') cdl_class;
    @attr()         cdl_endorsements;
    @attr()         cdl_restrictions;
    @attr('string') issuing_country;
    @attr('string') issuing_province_state;
    @attr('date')   issue_date;
    @attr('date')   expiry_date;
    @attr('boolean') is_expired;
    @attr('number')  days_until_expiry;
    @attr('string')  status;
    @attr('string')  notes;
    @attr()          meta;
    @attr('date')    updated_at;
    @attr('date')    created_at;

    @computed('is_expired', 'days_until_expiry')
    get expiryBadgeClass() {
        if (this.is_expired) return 'red';
        if (this.days_until_expiry <= 30) return 'yellow';
        return 'green';
    }
}
