import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface PaypalItem{

      name: string,
      quantity: string,
      category: string,
      unit_amount: {
          currency_code: string,
          value: string
          //currency_code: 'USD',
          //value: '495',
      },
  
}

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
    registrationType: new FormControl('', Validators.required),
    semester: new FormControl(''),
    year: new FormControl(''),
    meal: new FormControl('', Validators.required),
    employment: new FormControl(''),
    golf: new FormControl('', Validators.required),
    poloSize: new FormControl('', Validators.required),
    occupation: new FormControl('', Validators.required),
    lineName: new FormControl('')
  });

  readonly PACKAGES: any = {
    1 : 295,
    2 : 395,
    3 : 495
  }

  readonly DISCOUNT: any = 100;

  readonly PACKAGE_NAMES: string[] = ['Early Bird', 'Regular Registration', 'Late Registration'];

  familyMembers: any = [];

  constructor(private http: HttpClient,
    private modalService: NgbModal){
  }

  ngOnInit(): void {
    //this.initConfig();
  }

  initConfig(): void {
    let items = this.familyMembers.map( (i:any) => {
        let item: PaypalItem = {
          name: i.type === 'child' ? 'Child Registration' : 'Guest Registration',
          quantity: '1',
          category: 'DIGITAL_GOODS',
          unit_amount: {
              currency_code: 'USD',
              value: i.price.toString(),
            }                    
        }
        return item;
    })

    let registrationPrice = (this.PACKAGES as any)[this.registrationForm.controls['package'].value];
    if(this.summary.discount)
      registrationPrice -= this.summary.discount;

    let item: PaypalItem = {
          name: 'ID50 Reunion Registration',
          quantity: '1',
          category: 'DIGITAL_GOODS',
          unit_amount: {
              currency_code: 'USD',
              value: registrationPrice,
            }                    
    }
    items.push(item);

    if(this.registrationForm.controls['golf'].value === 'Yes'){
      let golfAddon: PaypalItem = {
            name: 'ID50 Reunion Golf Event Addon',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
                currency_code: 'USD',
                value: "100",
              }                    
      }
      items.push(golfAddon);
    }

    console.log(items);
    this.payPalConfig = {
            currency: 'USD',
            // test account clientId: 'ARWt-fj_RMyst0oCnsSt57mSDaNeGYHG7hfjVDUhbLpnDf-bVvioHCvDX-cbISvn4ULbzHW2aZv8GTp8',
            clientId: 'AWXDUD1ohylmpcgPIsZB93y5EnbR52Wt2qEhavzPqvrxOyT0mPGgBif2HFGEqTgZK7S8-oL1DaDceB8Y',
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
                    items: items
                }]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'horizontal'
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
                //this.registrationForm.submit();
                this.submitRegistration();
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
    //return null;

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
        "package": this.registrationForm.controls['package'].value,
        "semester": this.registrationForm.controls['semester'].value,
        "year": this.registrationForm.controls['year'].value,
        "meal": this.registrationForm.controls['meal'].value,
        "guests": JSON.stringify(this.familyMembers),
        "employment": this.registrationForm.controls['employment'].value,
        "lineName": this.registrationForm.controls['lineName'].value,
        "golf": this.registrationForm.controls['golf'].value,
        "poloSize": this.registrationForm.controls['poloSize'].value,
        "occupation": this.registrationForm.controls['occupation'].value
      }, { headers: headers } )
    .subscribe( result => {
      console.log(result);
      this.showConfirmationModal();
      this.registrationForm.reset();
    });

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

    this.updatePriceAndSummary();
    this.initConfig();
  }


  updatePriceAndSummary(){    
    let summary = {
      package: 0,
      guests: 0,
      golf: 0,
      total: 0,
      discount: 0
    };

    summary['package'] = (this.PACKAGES as any)[this.registrationForm.controls['package'].value] || 0;
    summary['guests'] = this.familyMembers.reduce( (acc: number, val: any) => { return acc + val.price}, 0);
    summary['golf'] = this.registrationForm.controls['golf'].value === "Yes" ? 100 : 0;
    summary['discount'] = this.registrationForm.controls['year'].value < 2019 ? 0 : this.DISCOUNT;
    summary['total'] = summary['package'] + summary['guests'] + summary["golf"] - summary["discount"];
    this.summary = summary;
    
    if(this.registrationForm.controls['package'].value)
      this.initConfig();
    
  }

  showAddFamilyModal(){
    this.modalService.open(FamilyModalComponent, { centered: true })
    .result.then((response) => {     
      this.familyMembers.push({...response});
      this.updatePriceAndSummary();
    }, (err) => console.log(err));
  }

  updateTypeForm(event: any){
    const type = event.target.value;
    this.isIdBrother = type === 'id-brother' ? true : false;
  }

  removeRow(index: number){
    this.familyMembers.splice(index, 1);
    this.updatePriceAndSummary();
  }

  showConfirmationModal(){
    this.modalService.open(ConfirmationModalComponent, { centered: true })
    .result.then((response) => {
      console.log(response);

    }, (err) => console.log(err));
  }

}

@Component({
  imports: [ReactiveFormsModule, CommonModule],
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
              <div class="" *ngIf="familyForm.get('type')?.value !== 'child'">
                <label class="form-label">Select a meal for the Gala</label>
                <select class="form-select" formControlName="galaMeal">
                  <option value="chicken">Herb Roasted Chicken w/ lemon butter</option>
                  <option value="salmon">Italian Herb Roasted Salmon</option>
                  <option  value="vegan">Grilled Bruschetta stuffed Zucchini 
                </select>
              </div>
              <div class="">
                <label class="form-label">T-shirt Size</label>
                <select class="form-select" formControlName="shirtSize">
                  <option value="ysmall">Youth Small</option>
                  <option value="ymedium">Youth Medium</option>
                  <option value="ylarge">Youth Large</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xlarge">X Large</option>
                  <option value="2xlarge">2X Large</option>
                  <option value="3xlarge">3X Large</option>
                </select>                
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="dismiss()">Close</button>
            <button type="button" class="btn btn-primary" (click)="add()">Save & Add</button>
          </div>
  `,
  standalone: true  
})
export class FamilyModalComponent {
  constructor(public activeModal: NgbActiveModal){}
  
  familyForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    shirtSize: new FormControl('', Validators.required),
    galaMeal: new FormControl('chicken'),
  });

  add(){    
    this.activeModal.close(
      { 
        name: this.familyForm.controls['name'].value,
        age: this.familyForm.controls['age'].value,
        type: this.familyForm.controls['type'].value,
        meal: this.familyForm.controls['galaMeal'].value,
        shirtSize: this.familyForm.controls['shirtSize'].value,
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
        price = 50; 
        if(this.familyForm.controls['age'].value < 5){
          price = 0;
        }
        break;
      case 'other':
        price = 150; break;
    }

    return price;
  }
}



@Component({
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'confirmation-modal',
  template: `
          <div class="modal-header">
            <h5 class="modal-title">Registration complete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ message }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="dismiss()">Close</button>            
          </div>
  `,
  standalone: true  
})
export class ConfirmationModalComponent {
  constructor(public activeModal: NgbActiveModal){}
  
  message: string = "Greetings brother.  You have successfully registered for the ID50 reunion."

  dismiss(){
    this.activeModal.dismiss();
  }

  
}

