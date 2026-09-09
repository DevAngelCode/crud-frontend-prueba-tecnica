import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../../../core/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerModel } from '../../../../core/models/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-detail',
  imports: [CommonModule],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css'
})
export class CustomerDetailComponent implements OnInit{
 private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  customer: CustomerModel | null = null;

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Cliente no encontrado.';
      this.isLoading = false;
      return;
    }

    this.loadCustomer(Number(id));
  }

  private loadCustomer(id: number): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.findById(id).subscribe({

      next: (customer) => {

        this.customer = customer;
        this.isLoading = false;

      },

      error: (error) => {

        console.error(
          'Error al cargar cliente:',
          error
        );

        this.errorMessage =
          'No se pudo cargar la información del cliente.';

        this.isLoading = false;

      }

    });
  }

  editCustomer(): void {

    if (!this.customer) {
      return;
    }

    this.router.navigate([
      '/customers',
      this.customer.id,
      'edit'
    ]);
  }

  goBack(): void {

    this.router.navigate([
      '/customers'
    ]);
  }
}
