import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../../../core/services/customer.service';
import { CustomerModel } from '../../../../core/models/customer.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  customers = signal<CustomerModel[]>([]);
  searchTerm = signal('');
  isLoading = signal(true);

  currentPage = signal(1);
  pageSize = 10;

  filteredCustomers = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    if (!search) {
      return this.customers();
    }

    return this.customers().filter(customer =>
      `${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.company?.toLowerCase().includes(search) ||
      customer.country?.toLowerCase().includes(search)
    );
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredCustomers().length / this.pageSize)
  );

  paginatedCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.filteredCustomers().slice(start, end);
  });

  pages = computed(() =>
    Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    )
  );

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading.set(true);

    this.customerService.findAll().subscribe({
      next: (customers) => {
        this.customers.set(customers);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
  createCustomer(): void {
    this.router.navigate(['/customers/new']);
  }
}
