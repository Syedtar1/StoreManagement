import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Inventory } from 'src/app/models/inventory';
import { Order } from 'src/app/models/orders';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  
  form: FormGroup;
  public isRegisteredSuccessfully = false;
  public error: any;
  private orderData: Order;
  public isDisabled = false;
  public productData: Product[];
  public productlist:any[];
  public productPrice:any[];

  
  constructor(
    private orderService: OrderService,
    private _router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private _inventory:InventoryService) { 
    this.form = this.fb.group({
      customername: ['', Validators.required],
      contactnumber: ['', Validators.required],
      email: ['', Validators.email],
      productname: ['', Validators.required],
      manufacturer: ['', Validators.required],
      discount: ['', Validators.required],
      price: ['', Validators.required],
    });
  }
  

  ngOnInit(): void {

    this.orderService.getProduct().subscribe(
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
        const customername  = this.form.get('customername')?.value;
        const contactnumber = this.form.get('contactnumber')?.value;
        const email         = this.form.get('email')?.value;
        const productname   = this.form.get('productname')?.value;
        const manufacturer  = this.form.get('manufacturer')?.value;
        const discount      = this.form.get('discount')?.value;
        let price           = this.form.get('price')?.value;
        let discountedPrice =(price - (Number(price)*Number(discount)/100));

        var order ={
          customername:customername,
        contactnumber:contactnumber,
        email:email,        
        productname:productname,
        manufacturer:manufacturer, 
        discount:discount,  
        price:price,
        discountedPrice:discountedPrice}
        console.log(order);


        this.orderService.add(order).subscribe(
          (data) => {
            this.isDisabled = false;
            this.isRegisteredSuccessfully = true;
            this._inventory.inventory().subscribe(
              (data:Inventory[]) => data.forEach(
                item =>{
                  if(item.product ==productname)
                  {
                    var itemData:Inventory =item;
                    let stock:any =itemData.instock;

                    itemData.instock =Number(stock-1);
                    this._inventory.put(itemData).subscribe((data)=>{
                      this._router.navigate(['/order']);
                    },
                    (err: any) => console.log(err)
                    )
                  }
                }
              )
            )

            this._router.navigate(['/order']);
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


  setControlValue() {
    this.form.patchValue(this.orderData);
  }

  onCancel() {
    this._router.navigate(['/order']);
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
