import Component from '@glimmer/component';

export default class TruckingExpiryBadgeComponent extends Component {
    get color() {
        if (this.args.isExpired) return 'red';
        const days = this.args.daysUntilExpiry;
        if (typeof days === 'number' && days <= 30) return 'yellow';
        return 'green';
    }
    get label() {
        if (!this.args.value) return '—';
        const d = new Date(this.args.value);
        return d.toLocaleDateString('en-CA');
    }
}
