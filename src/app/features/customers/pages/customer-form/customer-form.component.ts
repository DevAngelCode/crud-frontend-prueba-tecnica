import { Component, inject } from '@angular/core';
import { CustomerCreateRequestModel } from '../../../../core/models/customer-create-request.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../../../core/services/customer.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  isSaving = false;
  errorMessage = '';

  customerForm = this.fb.nonNullable.group({
    customerId: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    company: [''],
    city: [''],
    country: [''],
    phone1: [''],
    phone2: [''],
    email: ['', Validators.email],
    subscriptionDate: ['', Validators.required],
    website: ['']
  });

  save(): void {

    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const request: CustomerCreateRequestModel =
      this.customerForm.getRawValue();

    this.customerService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/customers']);
      },
      error: (error) => {
        console.error('Error al crear cliente:', error);

        this.errorMessage =
          'No se pudo crear el cliente. Intenta nuevamente.';

        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
