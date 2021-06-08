import {
  BreakpointObserver,
  BreakpointState,
  MediaMatcher,
} from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AESEncryptDecryptService } from '../services/aesencrypt-decrypt.service';
import { AuthService } from '../services/auth.service';
import { NavItem } from './sidenav';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const SMALL_WIDTH_BREAKPOINT = 600;

@Component({
  selector: 'sidenav',
  templateUrl: 'sidenav.component.html',
  styleUrls: ['sidenav.component.css'],
})
export class SidenavComponent implements OnDestroy, OnInit {
  menu: NavItem[] = [];
  mobileQuery: MediaQueryList;
  public isScreenSmall: boolean = false;
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);
  private _mobileQueryListener: () => void;
  public userType: string;
  public fullName: string;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private breakPointObserver: BreakpointObserver,
    public auth: AuthService,
    private _security: AESEncryptDecryptService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.breakPointObserver
      .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
      .subscribe((state: BreakpointState) => {
        this.isScreenSmall = state.matches;
      });

    if (localStorage.getItem('usertype') !== null) {
      this.userType = this._security.decrypt(localStorage.getItem('usertype'));
      this.setManu();
    }
   
    if(localStorage.getItem('firstname') !== null && localStorage.getItem('lastname') !== null){
      this.fullName = this._security.decrypt(localStorage.getItem('firstname')) +' '+ this._security.decrypt(localStorage.getItem('lastname'));
      
    }
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  //shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  shouldRun = true;

  setManu() {
    if (this.userType === 'customer') {
      this.menu = [
        {
          displayName: 'profile',
          iconName: 'verified_user',
          route: '/profile',
        },
      ];
    } else {
      this.menu = [
        {
          displayName: 'Sales Order',
          iconName: 'shopping_cart',
          route: '/order',
        },
        {
          displayName: 'Live Inventory',
          iconName: 'ballot',
          route: '/inventory',
        },
        {
          displayName: 'Stock',
          iconName: 'description',
          route: '/distributors',
        },
        {
          displayName: 'profile',
          iconName: 'verified_user',
          route: '/profile',
        },
      ];
    }
  }
}
