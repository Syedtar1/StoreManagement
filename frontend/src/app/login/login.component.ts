import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IErrorMessage } from '../models/error';
import { AESEncryptDecryptService } from '../services/aesencrypt-decrypt.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  public loginInvalid = false;
  private formSubmitAttempt = false;
  private returnUrl: string;
  public isDisabled = false;
  public errorMessage:IErrorMessage;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService,
    private _security:AESEncryptDecryptService) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/order';

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // if (await this.authService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
    if(localStorage.getItem('token') !== null)
    {
      if(this._security.decrypt(localStorage.getItem('usertype')) !=='customer')
      this.router.navigate(['/order']);
      else 
      this.router.navigate(['/profile']);
    }

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });

   
  }
   onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    this.isDisabled =true;
    if (this.form.valid) {
      try {
        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;
        this.authService.login({
          email:username, 
          password:password
        }).subscribe(
          (data)=> {
            localStorage.setItem('token',data.token);
            
            localStorage.setItem('snapid',this._security.encrypt(data.userResult._id));
            localStorage.setItem('firstname',this._security.encrypt(data.userResult.firstname));
            localStorage.setItem('lastname',this._security.encrypt(data.userResult.lastname));
            localStorage.setItem('email',this._security.encrypt(data.userResult.email));
            localStorage.setItem('usertype',this._security.encrypt(data.userResult.usertype));
            localStorage.setItem('active',data.userResult.isactive? this._security.encrypt('Yes'): this._security.encrypt('No'));
            localStorage.setItem('IsLayout', 'true');
            
            this.isDisabled =false;
            window.location.reload();
            if(data.userResult.usertype ==='owner'){
                  this.router.navigate(['/order']);
                }
                else if(data.userResult.usertype ==='employee'){
              this.router.navigate(['/order']);
              }
              else 
              if(data.userResult.usertype ==='customer'){
                this.router.navigate(['/profile']);
              }
              
          }
          ,
          (err) => {
            this.errorMessage=err.error;
            this.loginInvalid=true;
            this.isDisabled=false;
            },
          () => console.log('all done.')
        
        );
      
        
      } catch (err) {
        this.loginInvalid = true;
        this.isDisabled =false;
      }
    } else {
      this.formSubmitAttempt = true;
      this.isDisabled =false;
    }
  }


}
