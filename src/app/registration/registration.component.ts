import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  })
  constructor(private http: HttpClient){
  }

  submitRegistration = ()=>{
    const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

    //event.stopPropagation();
    this.http.post('https://sbfoljdqs9.execute-api.us-east-1.amazonaws.com/dev/new-registration',
      {
        "firstName": this.registrationForm.controls['firstName'].value,
        "lastName": "Barns",
        "email": "mbarns@gmail.com",
        "package": 1,
        "semester": "Spring",
        "year": 2010
      }, { headers } )
    .subscribe( result => console.log(result));

  }

  updatePackage(item: number){
    console.log(item);
    this.registrationForm.controls["package"].setValue(item);
  }

}
