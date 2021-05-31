import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryServiceService } from 'src/app/category-service.service';
import { Category } from 'src/app/models/category';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { isNumber } from 'util';

@Component({
  selector: 'app-manage-sub-cat',
  templateUrl: './manage-sub-cat.component.html',
  styleUrls: ['./manage-sub-cat.component.css']
})
export class ManageSubCatComponent implements OnInit {

  constructor(private eventEmitter: EventemitterService,

    private fb: FormBuilder,
    private catSer: CategoryServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    let paramValue = this.activatedRoute.snapshot.paramMap.get("id")

    

    this.superCat = parseInt(paramValue);

    this.catSer.getOne(this.superCat).toPromise().then(data => {

      this.cat=data.title;

    }).catch(err => {
      this.eventEmitter.showPopUP({ type: "error", message: "Category with id " + paramValue + " not found" })
      this.router.navigateByUrl("/panel/categories")
    });

    this.displayData();

  }



  categoryForm = this.fb.group({
    id: [0, [Validators.required]],
    title: ['ffff', [Validators.required, Validators.minLength(3)]],

    createdDate: [new Date()]
  })

  cat: string;
  superCat: number = 0;
  showModal = false;
  showRoModal = false;
  deleteCategoryId: number;
  paginCategories: Observable<any>
  pageSize: number = 4;
  pageNumber: number = 0;

  categoryName: string;



  addCategory = true;

  displayData() {

    this.paginCategories = this.catSer.getAllPaginSubCat(this.pageSize, this.pageNumber, this.superCat, this.categoryName)


  }


  updatecategory() {



    if (this.categoryForm.valid) {


      let formValue = this.categoryForm.value;

      formValue.category = { "id": this.superCat }



      if (this.addCategory) {
        this.catSer.addSubCat(this.categoryForm.value).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: "success", message: "Category has been added" })
          this.displayData();
        }).catch(err => {
          this.eventEmitter.showPopUP({ type: "error", message: err.error })
        })
      } else {

        this.catSer.updateSubCat(this.categoryForm.value).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: "success", message: "Category has been updated" })
          this.displayData();
        }).catch(err => {
          this.eventEmitter.showPopUP({ type: "error", message: err.error })
        })

      }
      this.closeCategoryModal();
 

    }
  }



  openModal(id) {
    this.deleteCategoryId = id;

    this.showModal = true;
  }


  closeModal() {
    this.deleteCategoryId = undefined;

    this.showModal = false;
  }

  showCategoryModal(category: Category = null) {
    if (category) {
      this.id.setValue(category.id)
      this.title.setValue(category.title)

      this.creationDate.setValue(category.createdDate)

      this.addCategory = false;
    } else {

      this.id.setValue(0)
      this.title.setValue('')

      this.creationDate.setValue(new Date())

      this.addCategory = true;
    }

    this.showRoModal = true;
  }

  closeCategoryModal() {
    this.showRoModal = false;
  }


  deleteCategory() {


    this.catSer.deleteSubCat(this.deleteCategoryId).toPromise().then(data => {
      this.eventEmitter.showPopUP({ type: "success", message: data })
   
    }).catch(err => {
      this.eventEmitter.showPopUP({ type: "error", message: err.error })
      console.log(err.error);

    })

    this.displayData();
    this.closeModal();
  }

  incrementPages() {
    this.pageNumber++;
    this.displayData();
  }

  decrementPages() {
    this.pageNumber--;
    this.displayData();
  }

  filter() {

    this.displayData();
  }

  get id() {
    return this.categoryForm.get('id')

  }

  get title() {
    return this.categoryForm.get('title')

  }



  get creationDate() {
    return this.categoryForm.get('createdDate')
  }

}
