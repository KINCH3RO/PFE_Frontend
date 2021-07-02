import { Message } from "./message";
import { User } from "./user";

export class Chat {

    channel_Id: string;
    createdDate: Date;
    participants: User[];
    messages: Message[];
   
}
