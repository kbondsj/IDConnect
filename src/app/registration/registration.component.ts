import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public payPalConfig? : IPayPalConfig;
  public isIdBrother = false;
  public summary: any = {};

  private showSuccess = false;
  private showCancel = false;
  private showError = false;
  

  chapterYears = new Array(50).fill(0).map( (v,k) => k + 1974);

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
    registrationType: new FormControl('', Validators.required)
  });

  readonly PACKAGES = {
    1 : 295,
    2 : 395,
    3 : 495
  }

  familyMembers: any = [];

  constructor(private http: HttpClient,
    private modalService: NgbModal){
  }

  ngOnInit(): void {
    this.initConfig();
  }

  initConfig(): void {
    this.payPalConfig = {
            currency: 'USD',
            clientId: 'ARWt-fj_RMyst0oCnsSt57mSDaNeGYHG7hfjVDUhbLpnDf-bVvioHCvDX-cbISvn4ULbzHW2aZv8GTp8',
            createOrderOnClient: (data) => < ICreateOrderRequest > {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: this.summary.total,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: this.summary.total
                            }
                        }
                    },
                    items: [{
                        name: 'Enterprise Subscription',
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: 'USD',
                            value: '495',
                        },
                    }]
                }]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                actions.order.get().then((details:any) => {
                    console.log('onApprove - you can get full order details inside onApprove: ', details);
                });

            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                this.showSuccess = true;
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
                this.showCancel = true;

            },
            onError: err => {
                console.log('OnError', err);
                this.showError = true;
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
                //this.resetStatus();
            }
        };
  }

  submitRegistration() {

    for(let key in this.registrationForm.controls){
      console.log(this.registrationForm.controls[key].value);
    }
    return null;

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    //event.stopPropagation();
    this.http.post('https://sbfoljdqs9.execute-api.us-east-1.amazonaws.com/default/new-registration',
      {
        "firstName": this.registrationForm.controls['firstName'].value,
        "lastName": this.registrationForm.controls['lastName'].value,
        "email": this.registrationForm.controls['email'].value,
        "phone": this.registrationForm.controls['phone'].value,
        "street": this.registrationForm.controls['street'].value,
        "city": this.registrationForm.controls['city'].value,
        "state": this.registrationForm.controls['state'].value,
        "zip": this.registrationForm.controls['zipCode'].value,
        "package": 1,
        "semester": "Spring",
        "year": 2010
      }, { headers: headers } )
    .subscribe( result => console.log(result));

  }

  updatePackage(item: number){
    this.registrationForm.controls["package"].setValue(item);


    //remove previous selections if any
    let els = document.getElementsByClassName("option");    
    for(const idx of Object.keys(els)){      
      els[idx as any].classList.remove('selected');
    }
    

    if(document.getElementById("package-"+item) !== null){
      let el = document.getElementById("package-"+item);
      el!.classList.add("selected");
    }

    this.updatePriceAndSummary()
  }


  updatePriceAndSummary(){
    let summary = {
      package: 0,
      guests: 0,
      total: 0
    };

    summary['package'] = (this.PACKAGES as any)[this.registrationForm.controls['package'].value] || 0;
    summary['guests'] = this.familyMembers.reduce( (acc: number, val: any) => { return acc + val.price}, 0);
    summary['total'] = summary['package'] + summary['guests'];

    this.summary = summary;
    console.log("summary: ", summary);
    console.log("family: ", this.familyMembers);
  }

  showAddFamilyModal(){
    this.modalService.open(FamilyModalComponent, { centered: true })
    .result.then((response) => {
      console.log(response);
      this.familyMembers.push({name: response.name, age: response.age, type: response.type, price: response.price});
      this.updatePriceAndSummary();
    }, (err) => console.log(err));
  }

  updateTypeForm(event: any){
    const type = event.target.value;
    this.isIdBrother = type === 'id-brother' ? true : false;
  }

}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-family-modal',
  template: `
          <div class="modal-header">
            <h5 class="modal-title">Add Family Member</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="familyForm">
              <div class="">
                <label class="form-label">Name</label>
                <input class="form-control" type="text" placeholder="" formControlName="name"/>
              </div>
              <div class="">
                <label class="form-label">Age</label>
                <input class="form-control" type="number" placeholder="" formControlName="age"/>
              </div>
              <div class="">
                <label class="form-label">Type</label>
                <select class="form-select" formControlName="type">
                  <option value='spouse'>Spouse</option>
                  <option value='child'>Child</option>
                  <option value='other'>Other</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="dismiss()">Close</button>
            <button type="button" class="btn btn-primary" (click)="add()">Save changes</button>
          </div>
  `,
  standalone: true  
})
export class FamilyModalComponent {
  constructor(public activeModal: NgbActiveModal){}
  
  familyForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required)
  });

  add(){
    console.log(this.familyForm.controls['name'].value);
    this.activeModal.close(
      { 
        name: this.familyForm.controls['name'].value,
        age: this.familyForm.controls['age'].value,
        type: this.familyForm.controls['type'].value,
        price: this.getGuestPrice(this.familyForm.controls['type'].value,)
      }
    );
  }

  dismiss(){
    this.activeModal.dismiss();
  }

  getGuestPrice(familyMemberType: string){
    let price = 0;
    switch(familyMemberType){
      case 'spouse':
        price = 100; break;
      case 'child':
        price = 50; break;
      case 'other':
        price = 150; break;
    }

    return price;
  }
}

