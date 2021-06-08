import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router } from '@angular/router';
import { User } from 'src/app/models/users';
import { AESEncryptDecryptService } from 'src/app/services/aesencrypt-decrypt.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SharedService } from 'src/app/services/shared.service';



@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css']
})
export class UpdateprofileComponent implements OnInit, AfterViewInit{
  form: FormGroup;
  public isRegisteredSuccessfully = false;
  private formSubmitAttempt = false;
  private returnUrl: string;
  public error: any;
  private orderData: User;
  public isDisabled = false;
  public userType: string;


  constructor(
    private sharedService: SharedService,
    private _router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private _security:AESEncryptDecryptService,
    private _profileService:ProfileService) { 
    if (localStorage.getItem('usertype') !== null) {
      this.userType = this._security.decrypt(localStorage.getItem('usertype'));
    }
    this.form = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: this.userType==='owner'? ['', Validators.email]: [{ value: '', disabled: true }, Validators.email]
    });

  }

  ngAfterViewInit(): void {
    this.form.patchValue(this.orderData);
  }

  ngOnInit(): void {
    if (!this.sharedService.userData) {
      this._router.navigate(['/order']);
    }
    this.orderData = this.sharedService.userData;
    this.setControlValue();
  }


  onSubmit() {
    this.isRegisteredSuccessfully = false;
    this.formSubmitAttempt = false;
    this.isDisabled = true;

    if (this.form.valid) {
      try {
        this.orderData.firstname = this.form.get('firstname')?.value;
        this.orderData.lastname = this.form.get('lastname')?.value;
        this.orderData.email = this.form.get('email')?.value;

        this._profileService.put(this.orderData).subscribe(
          (data) => {
            this.isRegisteredSuccessfully = true;
            this.isDisabled = false;
            this._router.navigate(['/profile']);
          },
          (err: any) => console.log(err),
          () => console.log('All Done, getting data from server')
        );

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
  setControlValue() {
    this.form.patchValue(this.orderData);
  }

  onCancel() {
    this._router.navigate(['/profile']);
  }

}
