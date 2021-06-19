import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DistributorsInventory } from 'src/app/models/distributorsinventory';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { DistributorsinventoryService } from 'src/app/services/distributorsinventory.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-adddistributors',
  templateUrl: './adddistributors.component.html',
  styleUrls: ['./adddistributors.component.css']
})
export class AdddistributorsComponent implements OnInit {

  form: FormGroup;
  public isRegisteredSuccessfully = false;
  public error: any;
  private orderData: DistributorsInventory;
  public isDisabled = false;
  public productData: Product[];
  public productlist:any[];
  public productPrice:any[];

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private _distributors:DistributorsinventoryService,
    private _orderService:OrderService
  ) {

    this.form = this.fb.group({
      distributorname: ['', Validators.required],
      product: ['', Validators.required],
      manufacturer: ['', Validators.required],
      unitreceived: ['', Validators.required],
      distributorPrice: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this._orderService.getProduct().subscribe(
      (data:Product[]) => this.productData=data,
      (err) => {
        if(err instanceof HttpErrorResponse)
        {
            if(err.status ===401)
            {
                this._router.navigate(['/login']);
            }
        }
         }
    );
  }

  onSubmit() {
    this.isDisabled = true;
    this.isRegisteredSuccessfully = false;

    if (this.form.valid) {
      try {
       
        const distributorname  = this.form.get('distributorname')?.value;
        const product = this.form.get('product')?.value;
        const manufacturer         = this.form.get('manufacturer')?.value;
        const unitreceived   = this.form.get('unitreceived')?.value;
        const distributorPrice  = this.form.get('distributorPrice')?.value;

        var distributors ={
          distributorname:distributorname,
          product:product,
          manufacturer:manufacturer,        
          unitreceived:unitreceived,
          distributorPrice:distributorPrice, 
          deliveredon: new Date()
        }
        
        this._distributors.add(distributors).subscribe(
          (data) => {
            this.isDisabled = false;
            this.isRegisteredSuccessfully = true;
            this._router.navigate(['/distributors']);
          },
          (err: any) => console.log(err),
          () => console.log('All Done, getting data from server')
        );

      } catch (err) {
        this.error = err;
        this.isDisabled = false;
        this.isRegisteredSuccessfully = false;
      }
    } else {
    
      this.isDisabled = false;
    }
  }

  onCancel() {
    this._router.navigate(['/distributors']);
  }

  bindOtherSelect(filterVal: any) {

    this.productData.forEach(item => {

      if(item.manufacturer==filterVal)
      {
      this.productlist.push({Product:item.product});
      this.productPrice.push( {Price:item.mrp});
      }

    });

  }
}
