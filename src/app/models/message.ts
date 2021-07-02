import { Offer } from "./offer";

export class Message {

    id: number;
    fileUrl: string;
    messageType: string;
    originalFileName:string;
    content: string;
    sendDate: Date;
    senderid: number;
    action:string;
    customOfferPrice: number=null;
    customOfferDelTime: number=null;
    customOfferDelUnit: string=null;
    customOfferDescription: string=null;
    customOfferTargetedUser: number=null;
    customOfferExpirationDate: Date=null;
    customOfferTargetedOffer: Offer

}
