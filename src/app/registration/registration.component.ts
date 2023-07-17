import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  chapterYears = ["1974", "1975"];

  registrationForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    phone: new FormControl('', Validators.required),
    familyMembers: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    package: new FormControl('', Validators.required),
  });

  familyMembers: any = [];

  constructor(private http: HttpClient,
    private modalService: NgbModal){
  }

  submitRegistration = ()=>{
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    //event.stopPropagation();
    this.http.post('https://sbfoljdqs9.execute-api.us-east-1.amazonaws.com/default/new-registration',
      {
        "firstName": this.registrationForm.controls['firstName'].value,
        "lastName": "Barns",
        "email": "mbarns@gmail.com",
        "package": 1,
        "semester": "Spring",
        "year": 2010
      }, { headers: headers } )
    .subscribe( result => console.log(result));

  }

  updatePackage(item: number){
    console.log(item);
    this.registrationForm.controls["package"].setValue(item);
  }

  initiateStripeTransaction(){

  }

  showAddFamilyModal(){
    this.modalService.open(FamilyModalComponent, { centered: true })
    .result.then(() => {
      console.log("test");
      this.familyMembers.push({name: "Lou Jr", age: 1, type: "child"});
    });
  }

}

@Component({
  selector: 'app-family-modal',
  template: `
          <div class="modal-header">
            <h5 class="modal-title">Add Family Member</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label>Name</label>
            <input type="name" placeholder="Louis Dilbert Jr" />
            <br />
            <label>Type</label>
            <select>
              <option>Spouse</option>
              <option>Child</option>
              <option>Other</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" (click)="close()">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
  `,
  standalone: true
})
export class FamilyModalComponent {
  constructor(public activeModal: NgbActiveModal){}

  close(){
    this.activeModal.close();
  }
}

