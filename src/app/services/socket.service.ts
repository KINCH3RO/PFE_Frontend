import { Injectable } from '@angular/core';
import { webSocket } from "rxjs/webSocket";

import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from '../models/message';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  title = 'grokonez';
  description = 'Angular-WebSocket Demo';

  greetings: string[] = [];
  disabled = true;
  name: string;
  stompClient = null;


  constructor() { }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  connect() {

    if (!this.stompClient) {
      const socket = new SockJS('http://localhost:8080/api/webSocket');
      this.stompClient = Stomp.over(socket);

    }

    return this.stompClient;
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendEntrepriseData(id: number) {
    this.stompClient.send(
      '/app/participation',
      {},
      id
    );
  }

  
  sendChatData(message: Message,dest:string) {
    this.stompClient.send(
      '/app/message/'+dest,
      {},
      JSON.stringify( message)
    );
  }

  sendSupportChatData(message: Message,dest:string) {
    this.stompClient.send(
      '/app/supportRoom/'+dest,
      {},
      JSON.stringify( message)
    );
  }



  showGreeting(message) {
    this.greetings.push(message);
  }













}
