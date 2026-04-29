import Component from '@glimmer/component';
export default class TruckingDateRowComponent extends Component {
    get formatted() {
        if (!this.args.value) return '—';
        return new Date(this.args.value).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' });
    }
}
