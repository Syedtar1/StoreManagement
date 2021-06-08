import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AESEncryptDecryptService {

  secretKey = "storeKey";
  constructor() { }

  encrypt(value : any) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt : any):string{
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}