import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private _url="http://localhost:3000/api/inventory";
  constructor(private http:HttpClient) { }

  inventory():Observable<Inventory[]>
  {
      return this.http.get<Inventory[]>(this._url);
  }

 

  put(inventory:Inventory):Observable<Inventory>
  {
      return this.http.put<Inventory>(this._url,inventory);
  }
}
