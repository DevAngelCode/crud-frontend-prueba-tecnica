import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerModel } from '../models/customer.model';
import { MessageResponseModel } from '../models/message-response.model';
import { CustomerCreateRequestModel } from '../models/customer-create-request.model';
import { CustomerUpdateRequestModel } from '../models/customer-update-request.model';
import { PageResponseModel } from '../models/page-response.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/v1/customers';

  findAll(page: number, size: number, customerId?: string): Observable<PageResponseModel<CustomerModel>> {
    const params: any = {
      page: page.toString(),
      size: size.toString()
    };

    if (customerId && customerId.trim()) {
      params['customerId'] = customerId.trim();
    }

    return this.http.get<PageResponseModel<CustomerModel>>(this.apiUrl, { params });
  }

  findById(id: number): Observable<CustomerModel> {
    return this.http.get<CustomerModel>(`${this.apiUrl}/${id}`);
  }

  create(request: CustomerCreateRequestModel): Observable<MessageResponseModel> {
    return this.http.post<MessageResponseModel>(
      this.apiUrl,
      request
    );
  }

  update(
    id: number,
    request: CustomerUpdateRequestModel
  ): Observable<MessageResponseModel> {
    return this.http.put<MessageResponseModel>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  delete(id: number): Observable<MessageResponseModel> {
    return this.http.delete<MessageResponseModel>(
      `${this.apiUrl}/${id}`
    );
  }
}
