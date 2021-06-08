import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IErrorMessage } from '../models/error';
import {Inventory } from '../models/inventory';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, AfterViewInit {

displayedColumns: string[] = ['id', 'Product', 'Manufacturer', 'InStock', 'LastPurchaseOn'];
dataSource: MatTableDataSource<Inventory>;
inventoryData:Inventory[];
public errorMessage:IErrorMessage;
public isError = false;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private service:InventoryService,
              private _router:Router) { 
   
    
  }
 

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.loadData();
    
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
    this.service.inventory().subscribe(
      (data:Inventory[]) => this.dataSource.data=data,
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

  submit(data:Inventory):void{

    console.log(data);
  }

}
