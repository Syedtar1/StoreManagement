import { Injectable } from '@angular/core';
import { Order } from '../models/orders';
import { User } from '../models/users';


@Injectable()
export class SharedService {
  viewCustomerId: String;
  data:Order;
  userData:User
  constructor() {}

  setViewCustomerId(id:String) {
    this.viewCustomerId = id;
  }

  getViewCustomerId() {
    return this.viewCustomerId;
  }

  setData(data:Order)
  {
    this.data=data;
  }

  setUserData(data:User)
  {
    this.userData=data;
  }



}