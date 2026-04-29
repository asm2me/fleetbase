import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function () {
    this.route('index', { path: '/' });
    this.route('containers', function () {
        this.route('index', { path: '/' });
        this.route('details', { path: '/:id' });
        this.route('new', { path: '/new' });
    });
    this.route('truck-documents', function () {
        this.route('index', { path: '/' });
        this.route('new', { path: '/new' });
    });
    this.route('driver-documents', function () {
        this.route('index', { path: '/' });
        this.route('new', { path: '/new' });
    });
    this.route('charges', function () {
        this.route('index', { path: '/' });
        this.route('new', { path: '/new' });
    });
});
