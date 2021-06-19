import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/orders';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _url = 'http://localhost:3000/api/order';
  private _urlProduct = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient) {}

  //get
  get(): Observable<Order[]> {
    return this.http.get<Order[]>(this._url);
  }

  //get by id
  getById(_id: String): Observable<Order> {
    return this.http.get<Order>(this._url + '/' + _id);
  }

  //add
  add(order: any): Observable<Order> {
    return this.http.post<Order>(this._url, order);
  }

  //put
  put(order: Order): Observable<Order> {
    return this.http.put<Order>(this._url, order);
  }

  //delete
  delete(id: string): Observable<Order> {
    return this.http.delete<Order>(this._url + '/' + id);
  }

  getProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(this._urlProduct);
  }
}
