import Component from '@glimmer/component';

const COLOR_MAP = {
    created: 'gray', loaded: 'blue', gated_out: 'indigo',
    in_transit: 'cyan', at_border: 'yellow', customs_hold: 'red',
    customs_cleared: 'green', delivered: 'emerald',
    returned: 'orange', empty_returned: 'slate', scrapped: 'zinc',
};

export default class TruckingStatusBadgeComponent extends Component {
    get color() { return COLOR_MAP[this.args.status] || 'gray'; }
    get label() { return (this.args.status || '').replace(/_/g, ' '); }
}
