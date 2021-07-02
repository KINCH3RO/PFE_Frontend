import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, OnDestroy {

  chatRooms: Observable<Chat[]>
  selectedChannel_ID = "123";
  myId: number;
  env: any;
  stompClient: any;
  message: string = "";
  messages: Message[] = [];
  participants: User[] = [];
  showModal: boolean = false;
  showForm: boolean = false;
  offers: Observable<any>
  otherSpeciality:string
  selectedOffer: Offer = null;
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
    private profileSer:ProfileService) {

  }
  ngOnDestroy(): void {
    this.disconnect();
  }

  ngOnInit(): void {
    this.env = environment;
    this.myId = this.auth.localUserId();
    this.chatRooms = this.chatService.findAllByUser(this.myId);
    let paramValue = this.activatedRoute.snapshot.paramMap.get("id");




    //intializing socket
    const _this = this;
    this.stompClient = this.socket.connect();
    this.stompClient.connect({}, function (frame) {


      console.log('Connected: ' + frame);
      _this.chatRooms.toPromise().then(data => {
        if (data.length > 0) {
          if (paramValue) {
            _this.selectChannel(paramValue);
          } else {
            _this.selectChannel(data[0].channel_Id)
          }

        }
      })

    });

   


  }



  customOfferForm: FormGroup = this.fb.group({
    //autoFill
    messageType: ['customOffer', [Validators.required]],
    sendDate: [new Date(), [Validators.required]],
    customOfferTargetedUser: ['', [Validators.required, Validators.min(1)]],
    customOfferTargetedOffer: ['', [Validators.required]],
    senderid: [this.auth.localUserId(), [Validators.required]],
    action: ['Create', [Validators.required]],
    //toFill²
    customOfferPrice: ['', [Validators.required, Validators.min(1)]],
    customOfferDelTime: ['', [Validators.required, Validators.min(1)]],
    customOfferDelUnit: ['Hours', [Validators.required]],
    customOfferDescription: [0, [Validators.required, Validators.minLength(20)]],
    customOfferExpirationDate: ['', [Validators.required]]
  })
  get customOfferTargetedUser() {
    return this.customOfferForm.get("customOfferTargetedUser");
  }

  get customOfferPrice() {
    return this.customOfferForm.get("customOfferPrice");
  }
  get customOfferDelTime() {
    return this.customOfferForm.get("customOfferDelTime");
  }
  get customOfferDelUnit() {
    return this.customOfferForm.get("customOfferDelUnit");
  }
  get cusomOfferDescription() {
    return this.customOfferForm.get("cusomOfferDescription");
  }

  get customOfferExpirationDate() {
    return this.customOfferForm.get("customOfferExpirationDate");
  }

  get customOfferTargetedOffer() {
    return this.customOfferForm.get("customOfferTargetedOffer");
  }
  ShowModal() {
    this.showModal = !this.showModal;
    if (this.showModal) {
      this.showForm = false;
    }
    if (!this.offers) {
      this.offers = this.offerSer.findAllByUserAndType(this.auth.localUserId(), true);
    }

  }

  selectOffer(offer: Offer) {
    this.selectedOffer = offer;
    this.customOfferTargetedOffer.setValue({ id: offer.id });
    this.customOfferTargetedUser.setValue(this.getOther().idUser)
  }


  openFile() {

    let element: HTMLElement = document.getElementById("file") as HTMLElement;
    element.click();

  }

  sendCustomOffer() {
    if (this.customOfferForm.valid) {
      let m: Message = this.customOfferForm.value;
      console.log(m);

      this.socket.sendChatData(m, this.selectedChannel_ID);
      this.customOfferForm.reset();
      this.ShowModal();


    }
  }

  getOffer(id) {
    let offer;
    this.offerSer.findOfferById(id).toPromise().then(data => {
      console.log(data);

    });

  }

  // toblob(data: any) {
  //   const blob = new Blob([data], { type: 'text/csv' });
  //   const url= window.URL.createObjectURL(blob);
  //   window.open(url);
  // }
  // downloadFile(filename): void {
  //   this.fileUpload
  //     .download(filename)
  //     .subscribe(blob => this.toblob(blob));
  // }

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
      m.action="Create"
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
     this.selectedMessage=null;

  }
  sendMessage() {
    if(this.SendOrEdit=="Send"){
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

  selectChannel(channel_id: string) {
    const _this = this;
    if (this.selectedChannel_ID == channel_id) {
      return;
    }
    this.chatService.getChat(channel_id).toPromise().then(data => {
      this.participants = data.participants;
      this.messages = data.messages;
      this.profileSer.getSpeciality(this.getOther().idUser).toPromise().then(data=>this.otherSpeciality=data);
    })
    this.selectedChannel_ID = channel_id;

  

    if (this.stompClient != null) {
      this.stompClient.subscribe('/socketBroker/room/' + channel_id, function (data) {
        _this.manageMessage(data)

      });
    }
  }

  manageMessage(data) {
    let receivedMessage:Message= JSON.parse(data.body)
    switch (receivedMessage.action) {
      case "Create":this.messages.push(receivedMessage); break;
      case "Update":this.messages.find(x=>x.id==receivedMessage.id).content=receivedMessage.content; break;
      case "Delete":
        this.messages.splice(this.messages.indexOf(this.messages.find(x=>x.id==receivedMessage.id)),1); break;
        
    }
    setTimeout(() => {
      this.scrollToElement();
    }, 100);


  }
  disconnect() {
    this.stompClient.disconnect();
  }




}
