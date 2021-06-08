import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IErrorMessage } from '../models/error';
import {DistributorsInventory } from '../models/distributorsinventory';
import { DistributorsinventoryService } from '../services/distributorsinventory.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router';
import { AESEncryptDecryptService } from '../services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-distributorsinventory',
  templateUrl: './distributorsinventory.component.html',
  styleUrls: ['./distributorsinventory.component.css']
})
export class DistributorsinventoryComponent implements OnInit, AfterViewInit {


  displayedColumns: string[] = ['id', 
  'Product', 'Manufacturer', 'DistributorName',
   'UnitReceived', 'DistributorPrice', 'DeliveredOn'];



  dataSource: MatTableDataSource<DistributorsInventory>;
  inventoryData:DistributorsInventory[];
  public errorMessage:IErrorMessage;
  public isError = false;
  public useType:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service:DistributorsinventoryService,
              private _router:Router,
              private _security:AESEncryptDecryptService) { 
   
    
  }
 

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.loadData();
    
  }

  ngAfterViewInit(): void {
    if(localStorage.getItem('usertype') !== null)
    {
        this.useType = this._security.decrypt(localStorage.getItem('usertype'));
    }
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
    this.service.DistributorsInventory().subscribe(
      (data:DistributorsInventory[]) => this.dataSource.data=data,
      (err) => {
        if(err instanceof HttpErrorResponse)
        {
            if(err.status ===401)
            {
                this._router.navigate(['/login']);
            }
        }
        this.errorMessage=err.error;
        this.isError = true; }
    )
  }

}
