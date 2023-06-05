import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  registrationForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    phone: new FormControl('', Validators.required),
    familyMembers: new FormControl('', Validators.required),
    /*address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    package: new FormControl('', Validators.required),*/
  })
  constructor(private http: HttpClient){

  }

  submitRegistration = ()=>{
    //event.stopPropagation();
    this.http.get('https://jsonplaceholder.typicode.com/todos/1')
    .subscribe( result => console.log(result));

  }

}
