import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  loginSuccessful: boolean = false;

  adminForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(private http: HttpClient){

  }

  adminLogin = (event: any) => {
    console.log("login");
    this.loginSuccessful = true;
    this.getPageData();
  }

  getPageData = ()=> {
    this.http.get('https://yrf3lzqc4l.execute-api.us-east-1.amazonaws.com/default/get-registrations')
    .subscribe( response => console.log(response));
  }

}
