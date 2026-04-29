import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ChargesIndexController extends Controller {
    @service notifications;
    @service hostRouter;
    @service fetch;

    @tracked queryParams = ['page','limit','sort','query','status','charge_type'];
    @tracked page = 1; @tracked limit = 30; @tracked sort = '-created_at';
    @tracked query; @tracked status; @tracked charge_type;
    @tracked table;

    get columns() {
        return [
            { label: 'Charge Type',      valuePath: 'charge_type',       sortable: true },
            { label: 'Container',        valuePath: 'container_uuid',    sortable: false, width: '130px' },
            { label: 'Party Responsible',valuePath: 'party_responsible', sortable: false },
            { label: 'Start Date',       valuePath: 'charge_start_date', sortable: true, width: '110px' },
            { label: 'End Date',         valuePath: 'charge_end_date',   sortable: true, width: '110px' },
            { label: 'Free Days',        valuePath: 'free_days_allowed', sortable: false, width: '80px' },
            { label: 'Billable Days',    valuePath: 'billable_days',     sortable: false, width: '90px' },
            { label: 'Rate/Day',         valuePath: 'rate_per_day',      sortable: false, width: '90px' },
            { label: 'Amount',           valuePath: 'amount',            sortable: true, width: '100px' },
            { label: 'Currency',         valuePath: 'currency',          sortable: false, width: '70px' },
            { label: 'Status',           valuePath: 'status',            sortable: true, cellComponent: 'trucking/charge-status-badge', width: '110px' },
            { label: 'Overdue',          valuePath: 'is_overdue',        sortable: false, width: '80px' },
        ];
    }

    get actionButtons() {
        return [
            { icon: 'refresh', onClick: () => this.send('refreshModel'), helpText: 'Refresh' },
            { text: 'New Charge', type: 'primary', icon: 'plus', onClick: () => this.hostRouter.transitionTo('console.trucking.charges.new') },
        ];
    }

    @action async markPaid(charge) {
        try {
            await this.fetch.post(`/int/v1/trucking/container-charges/${charge.id}/mark-paid`, {
                paid_date: new Date().toISOString().slice(0,10),
                amount_paid: charge.amount,
            });
            this.notifications.success('Charge marked as paid.');
            charge.reload();
        } catch (e) { this.notifications.serverError(e); }
    }

    @action async dispute(charge) {
        const reason = window.prompt('Enter dispute reason:');
        if (!reason) return;
        try {
            await this.fetch.post(`/int/v1/trucking/container-charges/${charge.id}/dispute`, { dispute_reason: reason });
            this.notifications.success('Charge disputed.');
            charge.reload();
        } catch (e) { this.notifications.serverError(e); }
    }

    @action async waive(charge) {
        const reason = window.prompt('Enter waiver reason:');
        if (!reason) return;
        try {
            await this.fetch.post(`/int/v1/trucking/container-charges/${charge.id}/waive`, { reason });
            this.notifications.success('Charge waived.');
            charge.reload();
        } catch (e) { this.notifications.serverError(e); }
    }
}
