import Component from '@glimmer/component';
const MAP = { pending: 'yellow', invoiced: 'blue', paid: 'green', disputed: 'red', waived: 'gray', partial_waived: 'orange' };
export default class TruckingChargeStatusBadgeComponent extends Component {
    get color() { return MAP[this.args.status] || 'gray'; }
    get label() { return (this.args.status || '').replace(/_/g, ' '); }
}
