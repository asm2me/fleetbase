import FleetbaseAdapter from '@fleetbase/ember-core/adapters/fleetbase';
export default class TruckingChargeAdapter extends FleetbaseAdapter {
    namespace = 'int/v1/trucking';
    pathForType() { return 'charges'; }
}
