import { User } from "./user";

export class Recruitments {

    id: number;
    places: number;
    jobName: string;
    jobDescription: string;
    createdDate: Date;
    completed: boolean;
    participants: User[];

}
