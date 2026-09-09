import { Component, inject, OnInit } from '@angular/core';
import { CustomerCreateRequestModel } from '../../../../core/models/customer-create-request.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../../../core/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerUpdateRequestModel } from '../../../../core/models/customer-update-request.model';

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent implements OnInit{
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  customerId: number | null = null;

  isEditMode = false;
  isLoading = false;
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

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.customerId = Number(id);
      this.isEditMode = true;

      this.loadCustomer(this.customerId);
    }
  }

  private loadCustomer(id: number): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.findById(id).subscribe({

      next: (customer) => {

        this.customerForm.patchValue({
          customerId: customer.customerId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          company: customer.company ?? '',
          city: customer.city ?? '',
          country: customer.country ?? '',
          phone1: customer.phone1 ?? '',
          phone2: customer.phone2 ?? '',
          email: customer.email ?? '',
          subscriptionDate: customer.subscriptionDate ?? '',
          website: customer.website ?? ''
        });

        this.customerForm.controls.customerId.disable();

        this.isLoading = false;
      },

      error: (error) => {

        console.error('Error al cargar cliente:', error);

        this.errorMessage =
          'No se pudo cargar la información del cliente.';

        this.isLoading = false;
      }

    });
  }

  save(): void {

    if (this.customerForm.invalid) {

      this.customerForm.markAllAsTouched();

      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    if (this.isEditMode && this.customerId !== null) {

      const value = this.customerForm.getRawValue();

      const request: CustomerUpdateRequestModel = {
        firstName: value.firstName,
        lastName: value.lastName,
        company: value.company,
        city: value.city,
        country: value.country,
        phone1: value.phone1,
        phone2: value.phone2,
        email: value.email,
        subscriptionDate: value.subscriptionDate,
        website: value.website
      };

      this.customerService
        .update(this.customerId, request)
        .subscribe({

          next: () => {
            this.router.navigate(['/customers']);
          },

          error: (error) => {

            console.error(
              'Error al actualizar cliente:',
              error
            );

            this.errorMessage =
              'No se pudo actualizar el cliente.';

            this.isSaving = false;
          }

        });

      return;
    }

    const request: CustomerCreateRequestModel =
      this.customerForm.getRawValue();

    this.customerService
      .create(request)
      .subscribe({

        next: () => {
          this.router.navigate(['/customers']);
        },

        error: (error) => {

          console.error(
            'Error al crear cliente:',
            error
          );

          this.errorMessage =
            'No se pudo crear el cliente.';

          this.isSaving = false;
        }

      });
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
