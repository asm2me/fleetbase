import { MenuItem } from '@fleetbase/ember-core/contracts';

export default {
    setupExtension(app, universe) {
        const menuService = universe.getService('universe/menu-service');

        menuService.registerHeaderMenuItem('Trucking', 'console.trucking', {
            icon: 'truck-container',
            priority: 5,
            description: 'Canada/US trucking compliance — container lifecycle, authorizations, and charges.',
            shortcuts: [
                {
                    title: 'Containers',
                    description: 'Track container lifecycle from gate-in through delivery and return.',
                    icon: 'box',
                    route: 'console.trucking.containers',
                },
                {
                    title: 'Truck Documents',
                    description: 'Manage USDOT, MC#, CVOR, insurance, and other truck authorizations.',
                    icon: 'file-contract',
                    route: 'console.trucking.truck-documents',
                },
                {
                    title: 'Driver Documents',
                    description: 'Track CDL, FAST card, NEXUS, medical certificates, and more.',
                    icon: 'id-card',
                    route: 'console.trucking.driver-documents',
                },
                {
                    title: 'Charges',
                    description: 'Manage demurrage, detention, and other container charges.',
                    icon: 'file-invoice-dollar',
                    route: 'console.trucking.charges',
                },
            ],
        });
    },
};
