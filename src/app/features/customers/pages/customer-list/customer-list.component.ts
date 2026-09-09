import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomerService } from '../../../../core/services/customer.service';
import { CustomerModel } from '../../../../core/models/customer.model';

@Component({
  selector: 'app-customer-list',
  imports: [FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  customers = signal<CustomerModel[]>([]);
  searchTerm = signal('');
  isLoading = signal(true);

  currentPage = signal(0);
  pageSize = 10;
  totalElements = signal(0);

  totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.pageSize)
  );

  visiblePages = computed<number[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage() + 1;
    const windowSize = 5;
    const pages: number[] = [];

    const start = Math.max(1, current - Math.floor(windowSize / 2));
    const end = Math.min(total, start + windowSize - 1);

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push(-1);
      }
    }

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (end < total) {
      if (end < total - 1) {
        pages.push(-2);
      }
      pages.push(total);
    }

    return pages;
  });

  isEllipsis = (page: number): boolean => page < 0;

  hasPreviousPage = computed(() => this.currentPage() > 0);
  hasNextPage = computed(() => this.currentPage() < this.totalPages() - 1);

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading.set(true);

    this.customerService
      .findAll(this.currentPage(), this.pageSize, this.searchTerm())
      .subscribe({
        next: (response) => {
          this.customers.set(response.content);
          this.totalElements.set(response.totalElements);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error al obtener clientes:', error);
          this.isLoading.set(false);
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los clientes.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }

  onSearch(): void {
    this.currentPage.set(0);
    this.loadCustomers();
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.onSearch();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page - 1);
      this.loadCustomers();
    }
  }

  createCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  editCustomer(id: number): void {
    this.router.navigate(['/customers', id, 'edit']);
  }

  viewCustomer(id: number): void {
    this.router.navigate(['/customers', id]);
  }

  deleteCustomer(customer: CustomerModel): void {
    Swal.fire({
      title: '¿Eliminar cliente?',
      html: `Se eliminará a <strong>${customer.firstName} ${customer.lastName}</strong>. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.customerService.delete(customer.id).subscribe({
        next: () => {
          this.loadCustomers();
          Swal.fire({
            title: 'Eliminado',
            text: 'El cliente se eliminó correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el cliente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    });
  }
}
