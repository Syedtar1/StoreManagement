import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})


export class ProfileService {
  private _url="http://localhost:3000/api/profile";
  private _urlByID="http://localhost:3000/api/profileBy";
  private _urlReset="http://localhost:3000/api/resetpassword";
  private _urlLock="http://localhost:3000/api/useraccess";
  constructor(private _http:HttpClient) { }


  //get profile all
  get():Observable<User[]>
  {
      return this._http.get<User[]>(this._url);
  }

  //get by id
  getByID(_id:String):Observable<User[]>
  {
    return this._http.get<User[]>(this._urlByID+'/'+_id);
  }

  //update profile
  put(data:User):Observable<User>
  {
    return this._http.put<User>(this._url,data);
  }

  //reset user password
  resetPassword(data:User):Observable<User>
  {
    return this._http.put<User>(this._urlReset,data);
  }

  //lock or unlock user account
  userAccess(data:User):Observable<User>
  {
    return this._http.put<User>(this._urlLock,data);
  }


}
