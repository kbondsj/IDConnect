import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

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

  constructor(private http: HttpClient){

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
      console.log(response);
      this.registrations = this.sortRegistrations(response);
    });
  }

  sortRegistrations(registrations: any){
    console.log(registrations[0]);
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

}
