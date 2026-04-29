import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TruckDocumentsIndexController extends Controller {
    @service notifications;
    @service hostRouter;

    @tracked queryParams = ['page','limit','sort','query','status','document_type'];
    @tracked page = 1; @tracked limit = 30; @tracked sort = 'expiry_date';
    @tracked query; @tracked status; @tracked document_type;
    @tracked table;

    get columns() {
        return [
            { label: 'Doc Type', valuePath: 'document_type', sortable: true },
            { label: 'Document #', valuePath: 'document_number', sortable: true },
            { label: 'Vehicle', valuePath: 'vehicle_uuid', sortable: false, width: '140px' },
            { label: 'Issuing Authority', valuePath: 'issuing_authority', sortable: false },
            { label: 'Country/Province', valuePath: 'issued_country', sortable: true, width: '130px' },
            { label: 'Issue Date', valuePath: 'issue_date', sortable: true, width: '110px' },
            { label: 'Expiry Date', valuePath: 'expiry_date', sortable: true, cellComponent: 'trucking/expiry-badge', width: '130px' },
            { label: 'Status', valuePath: 'status', sortable: true, cellComponent: 'trucking/doc-status-badge', width: '110px' },
        ];
    }

    get actionButtons() {
        return [
            { icon: 'refresh', onClick: () => this.send('refreshModel'), helpText: 'Refresh' },
            { text: 'Add Document', type: 'primary', icon: 'plus', onClick: () => this.hostRouter.transitionTo('console.trucking.truck-documents.new') },
        ];
    }
}
