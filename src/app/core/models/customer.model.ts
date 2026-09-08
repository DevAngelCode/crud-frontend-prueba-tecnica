export interface CustomerModel {
    id: number;
    customerId: string;
    firstName: string;
    lastName: string;
    company: string | null;
    city: string | null;
    country: string | null;
    phone1: string | null;
    phone2: string | null;
    email: string | null;
    subscriptionDate: string | null;
    website: string | null;
}
