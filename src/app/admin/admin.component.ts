import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  loginSuccessful: boolean = true;
  registrations: any = [];
  adminForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  registrationsChart = new Chart({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Guest Registrations'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['Registration Type', ]
    },
    series: [      
    ]
  } as any);

  golfChart: Chart = new Chart();
  mealsChart: Chart = new Chart();
  constructor(private http: HttpClient, private modalService: NgbModal){

  }

  ngOnInit(){
    this.getPageData();
  }

  adminLogin = (event: any) => {
    this.loginSuccessful = true;
    this.getPageData();
  }

  getPageData = ()=> {
    this.http.get('https://yrf3lzqc4l.execute-api.us-east-1.amazonaws.com/default/get-registrations')
    .subscribe( response => {
      this.registrations = this.sortRegistrations(response);
      this.configureCharts();
    });
  }

  configureCharts = () => {
    this.buildRegistrationsChart();
    this.buildGolfParticipantsChart();
    this.buildGalaMealsChart();
    
  }

  buildRegistrationsChart = ()=> {
    let spouse: any[] = [];
    let child: any[] = [];
    let other: any[] = [];    
    this.registrations.forEach((reg:any )=> {
      
      try{        
        const guests = JSON.parse(reg.guests);
        guests.forEach( (guest:any) => {          
          if(guest.type === 'spouse'){
            spouse.push(guest);            
          }else if(guest.type === 'child'){
            child.push(guest);
          }else if(guest.type === 'other'){
            other.push(guest);
          }        
        });
      }catch(e){
        console.log("Exception parsing: ", e);
      }
    });
    
    this.registrationsChart.addSeries({
      name: 'Registration',
      data: [
        this.registrations.length        
      ]
    } as any, true, true);
    this.registrationsChart.addSeries({
      name: 'Spouse',
      data: [
        spouse.length        
      ]
    } as any, true, true);
    this.registrationsChart.addSeries({
      name: 'Child',
      data: [
        child.length        
      ]
    } as any, true, true);
    this.registrationsChart.addSeries({
      name: 'Other',
      data: [
        other.length        
      ]
    } as any, true, true);
   
  }

  buildGolfParticipantsChart = ()=>{
    let count = 0;
    this.registrations.forEach((reg:any)=>{
      if(reg.golf === 'Yes'){
        count++;
      }
    })
    this.golfChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Confirmed Golfers'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: ['Golf']
      },
      series: [{
        name: "Golfers",
        data: [count]
      }
      ]
    } as any);
    //console.log("COUNT ", count);
  }

  buildGalaMealsChart = ()=>{
    let meals = { salmon: 0, chicken: 0, vegan: 0 }
    this.registrations.forEach( (reg:any) => {
      if(reg.meal === 'salmon'){
        meals.salmon++
      }else if (reg.meal === 'chicken'){
        meals.chicken++
      }else if(reg.meal === 'vegan'){
        meals.vegan++
      }
    })
    this.mealsChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Confirmed Golfers'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: ['Meal Selection']
      },
      series: [
        {
          name: "Salmon",
          data: [meals.salmon]
        },
        {
          name: "Chicken",
          data: [meals.chicken]
        },
        {
          name: "Vegan",
          data: [meals.vegan]
        }

      ]
    } as any);
    console.log(meals);
  }

  sortRegistrations(registrations: any){
    return registrations.sort( ( first:any, second:any ) => {
      if(first.registration_date < second.registration_date){
        return 1;
      }else if (first.registration_date > second.registration_date){
        return -1;
      }else{
        return 0;
      }
    });
  }

  showDetailsModal(registration: any){
    let modalRef = this.modalService.open(FullDetailsModalComponent, { centered: true });
    modalRef.componentInstance.registration = registration;
    modalRef.result.then((response) => {
      console.log(response);

    }, (err) => console.log(err));
  }

}




@Component({
  imports: [CommonModule],
  selector: 'full-details-modal',
  template: `
          <div class="modal-header">
            <h5 class="modal-title">Registration details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">            
            <div>Occupation: {{ registration.occupation }} </div>
            <div>Employment: {{ registration.employment }} </div>
            <div>Gala Meal: {{registration.meal}}</div>
            <div>Golf Addon: {{registration.golf}}</div>
            <div>Address: {{registration.street}} {{registration.city}}, {{registration.state}}, {{registration.zip}}</div>
            <div>Line Name: {{ registration.line_name }} </div>
            <div>Brotherhood: {{registration.semester}} {{registration.year}}</div>
            <div>Phone: {{ registration.phone }} </div>
            <div>Polo Size: {{ registration.poloSize }} </div>

            <div *ngIf="guestsJson.length == 0" class="guests" style="border-top: 1px solid #ccc">Guests: None </div>
            <div *ngIf="guestsJson.length > 0" class="guests" style="border-top: 1px solid #ccc">
              <ul><strong>Guests:</strong>
                <li *ngFor="let g of guestsJson"> {{g.type}}: {{g.name}} - Meal: {{g.meal}} - Shirt: {{g.shirtSize}} </li>
              </ul>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="dismiss()">Close</button>            
          </div>
  `,
  styles: ['.guests { margin-top: 20px; padding-top: 20px } ul li {list-style: none} ul{ padding-left: 0} '],
  standalone: true  
})
export class FullDetailsModalComponent implements OnInit{
  @Input() public registration: any;
  guestsJson: any;
  constructor(public activeModal: NgbActiveModal){}

  ngOnInit(){
    console.log(this.registration);
    this.guestsJson = JSON.parse(this.registration.guests);
    console.log(this.guestsJson);
  }
  
  message: string = "Greetings brother.  You have successfully registered for the ID50 reunion."

  dismiss(){
    this.activeModal.dismiss();
  }

  
}
