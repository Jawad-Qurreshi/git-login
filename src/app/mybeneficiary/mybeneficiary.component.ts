import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-mybeneficiary',
  templateUrl: './mybeneficiary.component.html',
  styleUrls: ['./mybeneficiary.component.css']
})
export class MybeneficiaryComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  benificiary_details: any;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  edit = function (id) {

    var beniid = CryptoJS.AES.encrypt(JSON.stringify(id), 'Zipcoin');
    localStorage.setItem("bid", beniid.toString());
    this.router.navigate(['/edit-benificiary']);

  }

  delete = function (id) {

    const deldata = `${this.hosturl + this.port + "/delete_benificiary/"}${id}`;
    this.http.delete(deldata).subscribe(
      (res: Response) => {
        if (res.json().success) {
          this.getbenificiary();
          alertify.success(res.json().msg);
        }
      }
    )

  }

  getbenificiary = function () {
    const cust_benificiary = `${this.hosturl + this.port + "/get_benificiary/"}${this.custid}`;
    this.http.get(cust_benificiary).subscribe(
      (res: Response) => {
        this.benificiary_details = res.json().get_benificiary;
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

        const cust_benificiary = `${this.hosturl + this.port + "/get_benificiary/"}${this.custid}`;
        this.http.get(cust_benificiary).subscribe(
          (res: Response) => {
            this.benificiary_details = res.json().get_benificiary;
          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
