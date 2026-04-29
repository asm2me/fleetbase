import FleetbaseAdapter from '@fleetbase/ember-core/adapters/fleetbase';
export default class TruckingDriverDocumentAdapter extends FleetbaseAdapter {
    namespace = 'int/v1/trucking';
    pathForType() { return 'driver-documents'; }
}
