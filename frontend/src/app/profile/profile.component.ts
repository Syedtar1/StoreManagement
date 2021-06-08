import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IErrorMessage } from '../models/error';
import { User } from '../models/users';
import { AESEncryptDecryptService } from '../services/aesencrypt-decrypt.service';
import { ProfileService } from '../services/profile.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  
public userType: string;
public userId: string;
displayedColumns: string[];
dataSource: MatTableDataSource<User>;
public errorMessage:IErrorMessage;
public isError = false;
public isDisabled = false;
public password:string;

@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

  constructor(
    private _router: Router,
    private _profileService: ProfileService,
    private _security: AESEncryptDecryptService,
    private _sharedService:SharedService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token') !== null) {
      this._router.navigate(['/profile']);
    }
   
    if (localStorage.getItem('usertype') !== null) {
      this.userType = this._security.decrypt(localStorage.getItem('usertype'));
    }
    if (localStorage.getItem('snapid') !== null) {
      this.userId = this._security.decrypt(localStorage.getItem('snapid'));
    }

    this.dataSource = new MatTableDataSource();
    this.loadData();
    
    if(this.userType==='owner')
    {
      this.displayedColumns=  ['id', 
'FirstName', 'LastName', 'Email', 
'UserType', 'Active', 'Update', 'Reset', 'UserAccess'];
    }
    else if(this.userType === 'employee'){
      this.displayedColumns=  ['id', 
      'FirstName', 'LastName', 'Email', 
      'UserType', 'Active', 'Update'];
    }
    else if(this.userType === 'customer'){
      this.displayedColumns=  ['id', 
      'FirstName', 'LastName', 'Email', 
      'UserType', 'Active'];
    }
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadData() {

    if(this.userType ==='owner')
    {

       //Get all users data
      this._profileService.get().subscribe(
        (data:User[]) => this.dataSource.data=data.filter(x=>x.usertype !=='owner'),
        (err) => {
          if(err instanceof HttpErrorResponse)
          {
              if(err.status ===401)
              {
                  this._router.navigate(['/login']);
              }
          }
          this.errorMessage=err.error;this.isError = true; }
      )

    }
    else {

      //Get By ID only for signed in employee
      this._profileService.getByID(this.userId).subscribe(
        (data:User[]) => {this.dataSource.data=data; console.log(data);
        console.log(this.dataSource.data);
        },
        (err) => {
          if(err instanceof HttpErrorResponse)
          {
              if(err.status ===401)
              {
                  this._router.navigate(['/login']);
              }
          }
          this.errorMessage=err.error;this.isError = true; }
      )

    }


  }

  
  resetPassword(data:User):void{

  this.password = this.generatePassword(8)
    data.password=this.password;


    this._profileService.resetPassword(data).subscribe(
      (Data) => {
        this.loadData();
      },
      (err)=> {
        if(err instanceof HttpErrorResponse)
        {
            if(err.status ===401)
            {
                this._router.navigate(['/login']);
            }
        }
      }
      
    )

    
  }


  update(data:User)
  {
    this._sharedService.setUserData(data);
    this._router.navigate(["profile/update"]);
  }

  lockUnlockUser(data:User):void {

    this.isDisabled =true;
    if(data.isactive)
        data.isactive=false;
        else
        data.isactive = true;


    this._profileService.userAccess(data).subscribe(
      (Data) => {
        this.loadData();
        this.isDisabled =false;
      },
      (err)=> {
        if(err instanceof HttpErrorResponse)
        {
            if(err.status ===401)
            {
                this._router.navigate(['/login']);
            }
        }
      }
      
    )

    
  }

   generatePassword(passwordLength:any) {
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var allChars = numberChars + upperChars + lowerChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    return this.shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
  }
  
   shuffleArray(array:any) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
}
