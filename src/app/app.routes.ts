import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full'
    },
    {
        path: 'customers',
        loadComponent: () =>
            import('./features/customers/pages/customer-list/customer-list.component')
                .then(m => m.CustomerListComponent)
    },
    {
        path: 'customers/new',
        loadComponent: () =>
            import('./features/customers/pages/customer-form/customer-form.component')
                .then(m => m.CustomerFormComponent)
    },
    {
        path: 'customers/:id/edit',
        loadComponent: () =>
            import('./features/customers/pages/customer-form/customer-form.component')
                .then(m => m.CustomerFormComponent)
    },
    {
        path: 'customers/:id',
        loadComponent: () =>
            import('./features/customers/pages/customer-detail/customer-detail.component')
                .then(m => m.CustomerDetailComponent)
    },
];
