import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IErrorMessage } from '../models/error';
import {Inventory } from '../models/inventory';
import { Order } from '../models/orders';
import { AESEncryptDecryptService } from '../services/aesencrypt-decrypt.service';
import { InventoryService } from '../services/inventory.service';
import { OrderService } from '../services/order.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

 
displayedColumns: string[];


dataSource: MatTableDataSource<Order>;
public errorMessage:IErrorMessage;
public isError = false;
public userType: string;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private service:OrderService,
              private _router:Router,
              private sharedService: SharedService,
              private _inventory:InventoryService,
              private _security:AESEncryptDecryptService) { 
   
    
  }
 

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.loadData();

    if (localStorage.getItem('usertype') !== null) {
      this.userType = this._security.decrypt(localStorage.getItem('usertype'));
    }


    if(this.userType==='owner')
    {
      this.displayedColumns=  ['id', 
'CustomerName', 'ContactNumber', 'Email', 
'ProductName', 'Manufacturer','Discount', 'Price', 'Update', 'Remove'];
    }
    else if (this.userType ==='employee'){
      this.displayedColumns=  ['id', 
'CustomerName', 'ContactNumber', 'Email', 
'ProductName', 'Manufacturer','Discount', 'Price', 'Update'];
    }
    
  }

  ngAfterViewInit(): void {
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  

  loadData():void{
    this.service.get().subscribe(
      (data:Order[]) => this.dataSource.data=data,
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

  submit(data:Order):void{

    this.service.delete(data._id).subscribe(
      (deletedData) => {
        
        this._inventory.inventory().subscribe(
          (data:Inventory[]) => data.forEach(
            item =>{
              if(item.product ==deletedData.productname)
              {
                var itemData:Inventory =item;
                let stock:any =itemData.instock;

                itemData.instock =Number(stock+1);
                this._inventory.put(itemData).subscribe((data)=>{
                  this._router.navigate(['/order']);
                },
                (err: any) => console.log(err)
                )
              }
            }
          )
        )


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


  update(data:Order)
  {
    this.sharedService.setData(data);
    this._router.navigate(["/order/update"]);
  }

}
