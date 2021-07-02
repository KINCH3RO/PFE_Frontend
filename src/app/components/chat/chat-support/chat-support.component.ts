import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Chat } from 'src/app/models/chat';
import { Message } from 'src/app/models/message';
import { Offer } from 'src/app/models/offer';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { OfferService } from 'src/app/services/offer.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-chat-support',
  templateUrl: './chat-support.component.html',
  styleUrls: ['./chat-support.component.css']
})
export class ChatSupportComponent implements OnInit {


  selectedChannel_ID = "123";
  myId: number;
  env: any;
  stompClient: any;
  message: string = "";
  messages: Message[] = [];
  participants: User[] = [];


  selectedMessage: Message = null;
  SendOrEdit = "Send"
  messageType = ["image", "video", "file", "text", "customOffer"]
  //emojis
  toggled: boolean = false;
  handleSelection(event) {
    this.message += event.char;

  }

  constructor(private chatService: ChatService,
    private auth: AuthService,
    private socket: SocketService,
    private activatedRoute: ActivatedRoute,
    private fileUpload: FileUploadService,
    private eventEmitter: EventemitterService,
    private offerSer: OfferService,
    private fb: FormBuilder,
    private profileSer: ProfileService) {

  }
  ngOnDestroy(): void {
    this.disconnect();
  }

  ngOnInit(): void {
    this.env = environment;
    this.myId = this.auth.localUserId();


    //intializing socket
    const _this = this;
    this.stompClient = this.socket.connect();
    this.stompClient.connect({ 'client-id': this.auth.localUserId() }, function (frame) {

      console.log('Connected: ' + frame);
     
        _this.stompClient.subscribe('/socketBroker/supportRoom/' + _this.auth.localUserId(), function (data) {
          _this.manageMessage(data)

        });
      

    });




  }



  



  openFile() {

    let element: HTMLElement = document.getElementById("file") as HTMLElement;
    element.click();

  }


  getOffer(id) {
    let offer;
    this.offerSer.findOfferById(id).toPromise().then(data => {
      console.log(data);

    });

  }



  downloadFile(fileUrl: string, fileName: string) {

    FileSaver.saveAs(this.env.endPoint + fileUrl, fileName);
  }
  async onFileSelected(event) {

    let imageExtenstion = ["png", "jpg", "jpeg"]
    let videoExtenstion = ["mp4", "webm"]

    //update user photo
    let selectedFile: File = event.target.files[0];
    let fileExtension = selectedFile.name.split('.').pop();
    let m = new Message();

    await this.fileUpload.uploadFileChat(selectedFile).then(data => {
      let fileType = imageExtenstion.includes(fileExtension.toLowerCase()) ? "image" : videoExtenstion.includes(fileExtension.toLowerCase()) ? "video" : "file";
      let filePath = imageExtenstion.includes(fileExtension.toLowerCase()) ? "/static/UploadedFiles/Images/" : videoExtenstion.includes(fileExtension.toLowerCase()) ? "/static/UploadedFiles/Videos/" : "/static/UploadedFiles/Files/";

      //filling message object
      m.content = this.message;
      m.originalFileName = selectedFile.name;
      m.senderid = this.myId;
      m.fileUrl = filePath + data;
      m.messageType = fileType;
      m.action = "Create"
      m.id = 0;
      m.sendDate = new Date();




    }).catch(err => {
      console.log(err)
      this.eventEmitter.showPopUP({ type: "error", message: err.error })
    });

    //sending data to web socket
    await new Promise(r => setTimeout(r, 2000))
    this.socket.sendChatData(m, this.selectedChannel_ID);
    this.message = "";
  }


  getUser(id: number) {
    return this.participants.find(x => x.idUser == id);
  }
  getMine() {
    return this.participants.find(x => x.idUser == this.auth.localUserId());
  }
  getOther() {
    return this.participants.find(x => x.idUser != this.auth.localUserId());
  }


  deleteMessage(message: Message) {
    let currentmessage = message;
    currentmessage.action = "Delete";
    this.socket.sendChatData(currentmessage, this.selectedChannel_ID);

  }

  Editmessage(ms: Message) {
    this.message = ms.content;
    this.selectedMessage = ms;
    this.SendOrEdit = "Edit";
  }
  saveAndSend() {
    if (this.selectedMessage.content == this.message) {
      return;
    }
    this.selectedMessage.content = this.message;
    this.selectedMessage.action = "Update";
    this.message = '';

    this.SendOrEdit = "Send";
    this.socket.sendChatData(this.selectedMessage, this.selectedChannel_ID);
    this.selectedMessage = null;

  }
  sendMessage() {
    if (this.SendOrEdit == "Send") {
      if (this.message.length > 0) {
        let m = new Message();
        m.content = this.message;
        m.senderid = this.myId;
        m.messageType = "text";
        m.id = 0;
        m.sendDate = new Date();
        m.action = "Create"

        this.socket.sendChatData(m, this.selectedChannel_ID);
        this.message = "";

      }
      return;

    }
    this.saveAndSend();



  }

  @ViewChild('target') private myScrollContainer: ElementRef;



  scrollToElement(): void {

    this.myScrollContainer.nativeElement.scroll({

      top: this.myScrollContainer.nativeElement.scrollHeight,

      left: 0,

      behavior: 'smooth'

    });

  }



  manageMessage(data) {
    let receivedMessage: Message = JSON.parse(data.body)
    switch (receivedMessage.action) {
      case "Create": this.messages.push(receivedMessage); break;
      case "Update": this.messages.find(x => x.id == receivedMessage.id).content = receivedMessage.content; break;
      case "Delete":
        this.messages.splice(this.messages.indexOf(this.messages.find(x => x.id == receivedMessage.id)), 1); break;

    }
    setTimeout(() => {
      this.scrollToElement();
    }, 100);


  }
  disconnect() {
    this.stompClient.disconnect();
  }

}
