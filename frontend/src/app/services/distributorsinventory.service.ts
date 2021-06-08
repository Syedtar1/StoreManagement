import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DistributorsInventory } from '../models/distributorsinventory';

@Injectable({
  providedIn: 'root'
})
export class DistributorsinventoryService {

  private _url="http://localhost:3000/api/distributorinventory";
 
  constructor(private http:HttpClient) { }

  DistributorsInventory():Observable<DistributorsInventory[]>
  {
      return this.http.get<DistributorsInventory[]>(this._url);
  }

  //add
  add(distributorsInventory:any):Observable<DistributorsInventory>
    {
        return this.http.post<DistributorsInventory>(this._url,distributorsInventory);
    }
}
