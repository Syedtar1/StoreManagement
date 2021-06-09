import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/orders';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  public isRegisteredSuccessfully = false;
  private formSubmitAttempt = false;
  private returnUrl: string;
  public error: any;
  private orderData: Order;
  public isDisabled = false;

  constructor(
    private sharedService: SharedService,
    private orderService: OrderService,
    private _router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      customername: ['', Validators.required],
      contactnumber: ['', Validators.required],
      email: ['', Validators.email],
      productname: [{ value: '', disabled: true }, Validators.required],
      manufacturer: [{ value: '', disabled: true }, Validators.required],
      discount: [{ value: '', disabled: true }, Validators.required],
      price: [{ value: '', disabled: true }, Validators.required],
    });
  }
  ngAfterViewInit(): void {
    this.form.patchValue(this.orderData);
  }

  ngOnInit(): void {
    if (!this.sharedService.data) {
      this._router.navigate(['/order']);
    }
    this.orderData = this.sharedService.data;
    this.setControlValue();
  }

  onSubmit() {
    this.isRegisteredSuccessfully = false;
    this.formSubmitAttempt = false;
    this.isDisabled = true;

    if (this.form.valid) {
      try {
        this.orderData.customername = this.form.get('customername')?.value;
        this.orderData.contactnumber = this.form.get('contactnumber')?.value;
        this.orderData.email = this.form.get('email')?.value;
        this.orderData.productname = this.form.get('productname')?.value;
        this.orderData.manufacturer = this.form.get('manufacturer')?.value;
        this.orderData.discount = this.form.get('discount')?.value;
        this.orderData.price = this.form.get('price')?.value;

        this.orderService.put(this.orderData).subscribe(
          (data) => {
            this.isRegisteredSuccessfully = true;
            this.isDisabled = false;
            this._router.navigate(['/order']);
          },
          (err: any) => console.log(err),
          () => console.log('All Done, getting data from server')
        );

      } catch (err) {
        this.isRegisteredSuccessfully = false;
        this.error = err;
        this.isDisabled = false;
      }
    } else {
      this.formSubmitAttempt = true;
      this.isDisabled = false;
    }
  }
  setControlValue() {
    this.form.patchValue(this.orderData);
  }

  onCancel() {
    this._router.navigate(['/order']);
  }
}
