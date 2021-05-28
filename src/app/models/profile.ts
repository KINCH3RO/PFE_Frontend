import { User } from "./user";

export class Profile {

    id: number;
    city: string;
    country: string;
    streetAddress: string;
    description: string;
    profileDate: Date;
    protfolioWebSiteUrl: string;
    speciality:string;
    primaryLanguage:string;
    completed:boolean;
   
    educations:[]
    certifications:[]
    occupations:[]
    languages:[]
    associatedAccounts:[]
    user:User

}
