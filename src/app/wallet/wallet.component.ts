import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
  providers: [DatePipe]
})
export class WalletComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  alltrans: any;
  total_wallet_amount: any;

  constructor(private http: Http, private router: Router, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });


  getwallet_trans = function () {

    const getwalletamount = `${this.hosturl + this.port + "/total_wallet/"}${this.custid}`;
    this.http.get(getwalletamount).subscribe(
      (res: Response) => {

        let amount = res.json().wallet_amount;
        
        if(amount[0].amount == null){
          this.total_wallet_amount = "0.00";
        } else {
          this.total_wallet_amount = amount[0].amount;
        }

      }
    )

    const getwallet = `${this.hosturl + this.port + "/allwalletdata/"}${this.custid}`;
    this.http.get(getwallet).subscribe(
      (res: Response) => {

        this.alltrans = res.json().transaction;

      }
    )
  }


  ngOnInit() {


    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    let decryptedData = localStorage.getItem('custid');

    if (decryptedData != null) {
      var bytes = CryptoJS.AES.decrypt(decryptedData.toString(), 'Zipcoin');
      this.custid = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (!this.custid) {
        this.router.navigate(['/login']);
      } else {

        this.getwallet_trans();

      }
    } else {
      this.router.navigate(['/login']);
    }


  }

}
