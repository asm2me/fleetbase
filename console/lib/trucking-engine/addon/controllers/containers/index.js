import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ContainersIndexController extends Controller {
    @service notifications;
    @service hostRouter;
    @service fetch;
    @service intl;

    @tracked queryParams = ['page','limit','sort','query','status','container_type'];
    @tracked page = 1;
    @tracked limit = 30;
    @tracked sort = '-created_at';
    @tracked query;
    @tracked status;
    @tracked container_type;
    @tracked table;
    @tracked selectedRow;
    @tracked isLoading = false;

    get columns() {
        return [
            { label: 'Container #', valuePath: 'container_number', sortable: true, width: '150px' },
            { label: 'Type', valuePath: 'container_type', sortable: true, width: '90px' },
            { label: 'Status', valuePath: 'status', sortable: true, cellComponent: 'trucking/status-badge', width: '130px' },
            { label: 'Shipping Line', valuePath: 'shipping_line', sortable: false },
            { label: 'B/L', valuePath: 'bill_of_lading', sortable: false },
            { label: 'Port Discharge', valuePath: 'port_of_discharge', sortable: false },
            { label: 'Demurrage Days', valuePath: 'demurrage_days', sortable: false, width: '110px' },
            { label: 'Detention Days', valuePath: 'detention_days', sortable: false, width: '110px' },
            { label: 'ETA', valuePath: 'estimated_arrival_at', sortable: true, width: '110px' },
            { label: 'Created', valuePath: 'created_at', sortable: true, width: '130px' },
        ];
    }

    get actionButtons() {
        return [
            { icon: 'refresh', onClick: () => this.refresh(), helpText: 'Refresh' },
            { text: 'New Container', type: 'primary', icon: 'plus', onClick: () => this.hostRouter.transitionTo('console.trucking.containers.new') },
        ];
    }

    @action refresh() {
        this.page = 1;
        this.send('refreshModel');
    }

    @action viewDetails(container) {
        this.hostRouter.transitionTo('console.trucking.containers.details', container.id);
    }

    @action async transition(container, status) {
        this.isLoading = true;
        try {
            await this.fetch.post(`/int/v1/trucking/containers/${container.id}/transition`, { status });
            this.notifications.success(`Container moved to: ${status.replace(/_/g, ' ')}`);
            container.reload();
        } catch (e) {
            this.notifications.serverError(e);
        } finally {
            this.isLoading = false;
        }
    }
}
