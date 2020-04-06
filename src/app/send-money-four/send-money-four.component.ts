import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-send-money-four',
  templateUrl: './send-money-four.component.html',
  styleUrls: ['./send-money-four.component.css']
})
export class SendMoneyFourComponent implements OnInit {


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  transdata: any;

  sendamount: any;
  sendcurrency: any;
  getamount: any;
  getcurrency: any;

  name: any;
  ifsc_code: any;
  account_number: any;

  promocode: any;
  upform: any;

  totamount: any;
  totfee: any;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  previous = function () {
    this.router.navigate(['./send-money-three']);
  }

  sendmoney = function (data) {

    if (data.promocode == "") {
      localStorage.removeItem("promocode");
    } else {

      var promo = CryptoJS.AES.encrypt(JSON.stringify(data.promocode), 'Zipcoin');
      localStorage.setItem("promocode", promo.toString());

    }

    var finaldata = {
      "sendid": this.upform,
      "scurrency": this.sendcurrency,
      "promocode": (data.promocode) ? data.promocode : ""
    }

    const url = `${this.hosturl + this.port + "/four/send_money"}`;
    this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
      .then((res: Response) => {
        if (res.json().success) {

          if (res.json().promo_val == "") {
            localStorage.removeItem("promoval");
          } else {
            var promoval = CryptoJS.AES.encrypt(JSON.stringify(res.json().promo_val), 'Zipcoin');
            localStorage.setItem("promoval", promoval.toString());
          }

          this.router.navigate(['./send-money-five']);

        } else {
          alertify.error("Please Enter Valid Promocode");
        }
      });


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

        this.promocode = "";

        let decryptedData_upform = localStorage.getItem('sendid');
        var bytes_upform = CryptoJS.AES.decrypt(decryptedData_upform.toString(), 'Zipcoin');
        this.upform = JSON.parse(bytes_upform.toString(CryptoJS.enc.Utf8));

        const gettrasferdata = `${this.hosturl + this.port + "/getsend_money_data/"}${this.upform}`;
        this.http.get(gettrasferdata).subscribe(
          (res: Response) => {
            this.transdata = res.json().transfer;

            this.sendamount = this.transdata[0].send_amount;
            this.sendcurrency = this.transdata[0].send_currency;
            this.getamount = this.transdata[0].get_amount;
            this.getcurrency = this.transdata[0].get_currency;

            let prom = this.transdata[0].promocode;
            if (prom == "") {
              this.promocode = "";
            } else {
              this.promocode = prom;
            }

            this.totfee = this.transdata[0].total_fee;
            this.totamount = this.transdata[0].total_amount;

            if (this.transdata[0].self_account_holder != "") {
              this.name = this.transdata[0].self_account_holder;
            }

            if (this.transdata[0].else_account_holder != "") {
              this.name = this.transdata[0].else_account_holder;
            }

            if (this.transdata[0].benificiary_id != "") {

              const recipientdata = `${this.hosturl + this.port + "/recipient_data/"}${this.transdata[0].benificiary_id}`;
              this.http.get(recipientdata).subscribe(
                (res: Response) => {
                  let getrec = res.json().benificiaryname;
                  this.name = getrec[0].name_business;
                });

            }

            if (this.transdata[0].agentid != "") {
              const agentdata = `${this.hosturl + this.port + "/agent_data/"}${this.transdata[0].agentid}`;
              this.http.get(agentdata).subscribe(
                (res: Response) => {
                  let getrec = res.json().agentname;
                  this.name = getrec[0].first_name;
                });
            }

          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }


  }

}
