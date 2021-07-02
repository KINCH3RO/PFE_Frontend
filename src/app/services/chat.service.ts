import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/chat';
import { User } from '../models/user';

declare var SockJS;
declare var Stomp;

@Injectable({
  providedIn: 'root'
})



export class ChatService {

 
  constructor(private http:HttpClient) {
  
  }

  findAllByUser(id:number){
    return this.http.get<Chat[]>("http://localhost:8080/api/chats/findAllByUser/"+id);
  }
  addChat(localid:number,otherid:number){

    let myuserDetails = new User();
    let profileUserDetails = new User();
    myuserDetails.idUser = localid;
    profileUserDetails.idUser = otherid;

    let c = new Chat();
    c.createdDate = new Date();
    c.participants = [myuserDetails, profileUserDetails]
    return this.http.post<Chat>("http://localhost:8080/api/chats/add",c);
  }
  getChat(channelId:string){
    return this.http.get<Chat>("http://localhost:8080/api/chats/"+channelId);
  }
  
  
  
  
  // initializeWebSocketConnection() {
  //   const serverUrl = 'http://localhost:8080/api/socket';
  //   const ws = new SockJS(serverUrl);
  //   this.stompClient = Stomp.over(ws);
  //   const that = this;
  //   // tslint:disable-next-line:only-arrow-functions
  //   this.stompClient.connect({}, function(frame) {
  //     that.stompClient.subscribe('/message', (message) => {
  //       if (message.body) {
  //         that.msg.push(message.body);
  //       }
  //     });
  //   });
  // }
  
  // sendMessage(message) {
  //   this.stompClient.send('/app/send/message' , {}, message);
  // }
}
