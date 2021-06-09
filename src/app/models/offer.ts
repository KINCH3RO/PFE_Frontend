import { Category } from "./category"
import { Plan } from "./plan";
import { User } from "./user"

export class Offer {
    id: number;
    description: string;
    serviceImageUrl: any[];
    mainPhotoIndex: number;
    title: string;
    videoImageUrl: any[];
    user: User;
    plans:Plan[];
    available: boolean
    category:  any | Category;
    subcat: Category;
    adresse: string;
    city: string;
    country: string;
    price: number;
    degital: boolean;
    lng:number=0;
    lat:number=0;
    deliveryTime: number;
	deliveryTimeUnit: string;
}

