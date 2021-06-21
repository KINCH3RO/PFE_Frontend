import { Offer } from "./offer";
import { User } from "./user";

export class Order {

    id: number;
    createdDate: Date;
    title: string;
    description: string;
    price:number;
    category: any;
    sub_category: any;
    degital: boolean;
    deliveryTime: number;
    deliveryTimeUnit: string;
    status:string;
    services:Offer[]
    user:User;
}
