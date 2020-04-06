import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-edit-eosaddress',
  templateUrl: './m-edit-eosaddress.component.html',
  styleUrls: ['./m-edit-eosaddress.component.css']
})
export class MEditEosaddressComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  adminid: any;

  eos_address: any;
  rateusd: any;
  ratecad: any;
  rategbp: any;
  rateeur: any;
  ratezar: any;


  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  eosdata = function (data) {

    let valid_rate = /^[0-9. ]*$/;
    let chkrateusd = valid_rate.test(data.rateusd);
    let chkratecad = valid_rate.test(data.ratecad);
    let chkrategbp = valid_rate.test(data.rategbp);
    let chkrateeur = valid_rate.test(data.rateeur);
    let chkratezar = valid_rate.test(data.ratezar);

    if (data.eos_address == "") {
      this.erreosaddress = false;
      alertify.error("Please Enter EOS Address");
    } else {
      this.erreosaddress = true;
    }

    if (data.rateusd == "" || chkrateusd == false) {
      this.errusd = false;
      alertify.error("Please enter valid ZIPCO rate in USD");
    } else {
      this.errusd = true;
    }

    if (data.ratecad == "" || chkratecad == false) {
      this.errcad = false;
      alertify.error("Please enter valid ZIPCO rate in CAD");
    } else {
      this.errcad = true;
    }

    if (data.rategbp == "" || chkrategbp == false) {
      this.errgbp = false;
      alertify.error("Please enter valid ZIPCO rate in GBP");
    } else {
      this.errgbp = true;
    }

    if (data.rateeur == "" || chkrateeur == false) {
      this.erreur = false;
      alertify.error("Please enter valid ZIPCO rate in EUR");
    } else {
      this.erreur = true;
    }

    if (data.ratezar == "" || chkratezar == false) {
      this.errzar = false;
      alertify.error("Please enter valid ZIPCO rate in ZAR");
    } else {
      this.errzar = true;
    }

    if (this.erreosaddress == true && this.errusd == true && this.errcad == true && this.errgbp == true
      && this.erreur == true && this.errzar == true) {

      var finaldata = {
        "address": data.eos_address,
        "rateusd": data.rateusd,
        "ratecad": data.ratecad,
        "rategbp": data.rategbp,
        "rateeur": data.rateeur,
        "ratezar": data.ratezar
      }

      const url = `${this.hosturl + this.port + "/edit_eosaddress"}`;
      this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            
            alertify.success(res.json().msg);
            this.router.navigate(['/m-eosaddress']);

          } else {
            alertify.error(res.json().msg);
          }
        })

    }

  }

  alladdress = function () {

    const getaddress = `${this.hosturl + this.port + "/all_eosaddress"}`;
    this.http.get(getaddress).subscribe(
      (res: Response) => {
        this.eosaddress = res.json().address;

        this.eos_address = this.eosaddress[0].eosaddress;
        this.rateusd = this.eosaddress[0].usd_rate;
        this.ratecad = this.eosaddress[0].cad_rate;
        this.rategbp = this.eosaddress[0].gbp_rate;
        this.rateeur = this.eosaddress[0].eur_rate;
        this.ratezar = this.eosaddress[0].zar_rate;

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

    let decryptedData = localStorage.getItem('adminid');
    if (decryptedData != null) {

      var bytes = CryptoJS.AES.decrypt(decryptedData.toString(), 'Zipcoin');
      this.adminid = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (!this.adminid) {
        this.router.navigate(['/login']);
      } else {

        this.alladdress();

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
