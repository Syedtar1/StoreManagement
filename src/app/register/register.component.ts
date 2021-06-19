import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  public isRegisteredSuccessfully = false;
  private formSubmitAttempt = false;
  private returnUrl: string;
  public error: any;
  public isDisabled = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/order';

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      usertype: ['', Validators.required],
    });
  }

  ngOnInit() {
    // if (await this.authService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      usertype: ['', Validators.required],
    });
  }
  onSubmit() {
    this.isRegisteredSuccessfully = false;
    this.formSubmitAttempt = false;
    this.isDisabled = true;
    if (this.form.valid) {
      try {
        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;
        const firstname = this.form.get('firstname')?.value;
        const lastname = this.form.get('lastname')?.value;
        const usertype = this.form.get('usertype')?.value;

        this.auth
          .register({
            usertype: usertype,
            firstname: firstname,
            lastname: lastname,
            email: username,
            password: password,
            isactive: true,
          })
          .subscribe(
            (data) => {
              this.isRegisteredSuccessfully = true;
              this.router.navigate(['/login']);
              this.clearForm();

              this.isDisabled = false;
            },
            (err: any) => console.log(err),
            () => console.log('All Done, getting data from server')
          );

        // console.log({
        //   usertype:usertype,
        //   firstname:firstname,
        //   lastname:lastname,
        //   username:username,
        //   password:password
        // });
      } catch (err) {
        this.isRegisteredSuccessfully = false;
        this.error = err;
        this.isDisabled = false;
      }
    } else {
      this.formSubmitAttempt = true;
      this.isDisabled = false;
    }
  }

  clearForm() {
    // this.form.reset({
    //   'usertype':'',
    //   'firstname':'',
    //   'lastname':'',
    //   'username':'',
    //   'password':'',
    //      });

    this.form.controls['firstname'].setValue(undefined);
    this.form.controls['lastname'].setValue(undefined);
    this.form.controls['username'].setValue(undefined);
    this.form.controls['password'].setValue(undefined);
    this.form.controls['usertype'].setValue(undefined);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }
}
