import Component from '@glimmer/component';
const MAP = { active: 'green', expired: 'red', suspended: 'yellow', revoked: 'red', pending_renewal: 'orange' };
export default class TruckingDocStatusBadgeComponent extends Component {
    get color() { return MAP[this.args.status] || 'gray'; }
    get label() { return (this.args.status || '').replace(/_/g, ' '); }
}
