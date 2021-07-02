import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, observable } from 'rxjs';
import { Entreprise } from 'src/app/models/entreprise';
import { EntreprisePosts } from 'src/app/models/entreprise-posts';
import { Recruitments } from 'src/app/models/recruitments';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entreprise-page',
  templateUrl: './entreprise-page.component.html',
  styleUrls: ['./entreprise-page.component.css']
})
export class EntreprisePageComponent implements OnInit {

  constructor(
    public entrepriseSer: EntrepriseService,
    private activatedRoute: ActivatedRoute,
    public auth: AuthService,
    private fb: FormBuilder,
    private eventEmitter: EventemitterService,
    private fileUpload: FileUploadService
    ) { }


  env;
  loadDetail = false;
  loadButtonText = "Load details";
  showModal = false;
  imagePath;
  imageValue;
  isMine = false;
  currentEntreprise: Entreprise;
  selectedFile: File;

  recruitments: Recruitments[] = [];
  enPosts: EntreprisePosts[] = [];
  jobInfo: string;
  stompClient;
  // 0 = RecruitmentForm , 1 = job info , 2 = posts
  modalIndex = 0;

  recruitmentForm: FormGroup = this.fb.group({
    id: [0, []],
    places: [0, [Validators.required, Validators.min(1)]],
    jobName: ['', [Validators.required, Validators.minLength(3)]],
    jobDescription: ['', [Validators.required, Validators.minLength(15)]],
    createdDate: [new Date(), []],
    completed: [false, []],
    participants: [[], []],
  })

  postForm: FormGroup = this.fb.group({
    id: [0, []],
    content: ['', [Validators.minLength(1)]],
    imageUrl: ['', []],
    createdDate: [new Date(), []]

  })



  get id() {
    return this.recruitmentForm.get('id');
  }
  get places() {
    return this.recruitmentForm.get('places');
  }
  get jobName() {
    return this.recruitmentForm.get('jobName');
  }
  get jobDescription() {
    return this.recruitmentForm.get('jobDescription');
  }
  get createdDate() {
    return this.recruitmentForm.get('createdDate');
  }

  get completed() {
    return this.recruitmentForm.get('completed');
  }

  get idP() {
    return this.postForm.get('id');
  }

  get content() {
    return this.postForm.get('content');
  }

  get imageUrl() {
    return this.postForm.get('imageUrl');
  }

  get createdDateP() {
    return this.postForm.get('createdDate');
  }

  ngOnInit(): void {

    this.env = environment;
    let paramValue = this.activatedRoute.snapshot.paramMap.get('id');
    if (parseInt(paramValue)) {
      this.displayData(parseInt(paramValue));

     

    }
  }



  displayData(id: number) {
    this.entrepriseSer.getEntreprise(id).subscribe(data => {
      this.currentEntreprise = data;
      this.isMine = (data.owner.idUser == this.auth.localUserId())
      this.recruitments = data.entrepriseRects ? data.entrepriseRects : [];
      this.enPosts = data.entreprisePosts ? data.entreprisePosts : [];
    });


  }

 

  isparticipating(recruitmentID) {

    if (this.recruitments[recruitmentID].participants.filter(x => x.idUser == this.auth.localUserId()).length > 0) {


      return true;
    }
    return false;
  }

  unParticipate(id) {

    let index = this.recruitments[id].participants.indexOf(this.recruitments[id].participants.filter(x => x.idUser == this.auth.localUserId())[0])
    if (index != -1) {
      this.recruitments[id].participants.splice(index, 1);
      this.entrepriseSer.updateEntreprise(this.currentEntreprise).toPromise().then(data => {



 
        this.eventEmitter.showPopUP({ message: "You are succesfully unparticipated", type: "info" })
      }).catch(err => {
        this.eventEmitter.showPopUP({ message: "an error occured", type: "error" })
      })
    }

  }


  participate(id) {


    if ((this.recruitments[id].participants.filter(x => x.idUser == this.auth.localUserId())).length > 0) {
      console.log((this.recruitments[id].participants.filter(x => x.idUser == this.auth.localUserId())));

      this.eventEmitter.showPopUP({ message: "You are already participating", type: "info" })
      return;

    }


    if (!this.recruitments[id].participants) {
      this.recruitments[id].participants = [];
    }


    this.recruitments[id].participants.push(this.auth.localUser())
    this.entrepriseSer.updateEntreprise(this.currentEntreprise).toPromise().then(data => {

     

     
      this.eventEmitter.showPopUP({ message: "You are succesfully participating", type: "info" })

    }).catch(err => {
      this.eventEmitter.showPopUP({ message: "an error occured", type: "error" })
    })

  }

  addRecruitments() {
    if (this.recruitmentForm.valid) {
      this.recruitments.push(this.recruitmentForm.value);
      this.currentEntreprise.entrepriseRects = this.recruitments;
      console.log(this.recruitments);

      console.log(this.currentEntreprise);

      this.entrepriseSer.updateEntreprise(this.currentEntreprise).toPromise().then(data => {
        this.eventEmitter.showPopUP({ message: "Recruitment has been added succesfully", type: "info" })
      }).catch(err => {
        this.eventEmitter.showPopUP({ message: "an error occured", type: "error" })
      })
    }
  }

  deleteRecruitments(id) {
    this.recruitments[id].completed = true;
    this.entrepriseSer.updateEntreprise(this.currentEntreprise).toPromise().then(data => {
      this.eventEmitter.showPopUP({ message: "Recruitment has been deleted succesfully", type: "info" })
    }).catch(err => {
      this.eventEmitter.showPopUP({ message: "an error occured", type: "error" })
    })


  }

  async addPost() {
    if (this.postForm.valid) {
      if (this.selectedFile) {
        await this.fileUpload.uploadFileEntreprise(this.selectedFile).then(data => {
          this.imageUrl.setValue("/static/UploadedFiles/Images/" + data);



        }).catch(err => {
          console.log(err);

          this.eventEmitter.showPopUP({ message: "error uploading post image", type: "error" })
        })
      }


      await new Promise(x => setTimeout(x, 3000))
      this.enPosts.push(this.postForm.value);



      this.currentEntreprise.entreprisePosts = this.enPosts;

      this.entrepriseSer.updateEntreprise(this.currentEntreprise).toPromise().then(data => {
        this.eventEmitter.showPopUP({ message: "Post added Succesfully", type: "info" })
        this.postForm.reset();
        this.imageValue = null;
        this.closeModal();
      }).catch(err => {
        this.eventEmitter.showPopUP({ message: "an error occured", type: "error" })
      })



    }
  }







  ShowModal(id: number, textInfo = '') {
    this.modalIndex = id;
    this.showModal = true;
    this.jobInfo = textInfo;

  }

  closeModal() {
    this.showModal = false;
  }

  showDetails() {
    this.loadDetail = !this.loadDetail;
    if (this.loadDetail) {
      this.loadButtonText = "Minimize details";
    } else {
      this.loadButtonText = "Load details";
    }
  }

  scroll(el: HTMLElement) {
    console.log(el);




    el.scrollIntoView({ behavior: 'smooth' });
  }

  openFile() {

    let element: HTMLElement = document.getElementById("file") as HTMLElement;
    element.click();

  }

  readURL(event): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageValue = reader.result;

      reader.readAsDataURL(this.selectedFile);
    }
  }

  onFileSelected(event) {
    console.log(event.target.files);

    this.imageValue = event.target.value;

  }


}
