import FleetbaseAdapter from '@fleetbase/ember-core/adapters/fleetbase';
export default class TruckingTruckDocumentAdapter extends FleetbaseAdapter {
    namespace = 'int/v1/trucking';
    pathForType() { return 'truck-documents'; }
}
