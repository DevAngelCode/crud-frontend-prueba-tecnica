export interface CustomerCreateRequestModel {
    customerId: string;
    firstName: string;
    lastName: string;
    company?: string;
    city?: string;
    country?: string;
    phone1?: string;
    phone2?: string;
    email?: string;
    subscriptionDate: string;
    website?: string;
}
