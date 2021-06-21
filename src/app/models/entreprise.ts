import { EntreprisePosts } from "./entreprise-posts";
import { Recruitments } from "./recruitments";
import { User } from "./user";

export class Entreprise {

    id: number;
    name: string;
    country: string;
    city: string;
    adresse: string;
    description: string;
    website: string;
    initiatedDate: Date;
    createdDate: Date;
    coverPhotoUrl: string;
    pagePhotoUrl:string;
    specialization: string;
    status: string;
    owner: User;
    entrepriseRects: Recruitments[]
    entreprisePosts: EntreprisePosts[]
}
