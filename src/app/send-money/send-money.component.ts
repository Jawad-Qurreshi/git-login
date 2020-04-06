import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.css']
})
export class SendMoneyComponent implements OnInit {
  getrs: any;

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;


  sendcurrency: any;
  senddisflage: any;

  getcurrency: any;
  getdisflage: any;

  send_amount: any;
  errsendamount: any;

  get_amount: any;
  errgetamount: any;

  convert: any;
  custid: any;

  transdata: any;
  view: any;

  upform: any;

  totfee: any;
  totamount: any;

  final_get_amount: any;
  errfinal_get_amount: any;
  fee: any;
  eosaddress: any;
  finalrate: number;
  disfee: any;

  vper: any;
  vtotal: any;
  vtot: any;

  visfee: any;
  amxfee: any;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });


  setconvert = function () {

    let valid_digit = /^[0-9. ]*$/;
    let chksend_amount = valid_digit.test(this.send_amount);

    if (this.send_amount == "" || chksend_amount == false) {
      this.errsendamount = false;
      this.get_amount = "";
      alertify.error("Please Enter Valid Amount");
    } else {

      if (this.send_amount >= 50) {
        if (this.send_amount >= 50 && this.send_amount <= 500) {

          if (this.sendcurrency == "USD") {

            this.errsendamount = true;
            this.totfee = 6.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.40).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "CAD") {

            this.errsendamount = true;
            this.totfee = 9.50;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.50).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "GBP") {

            this.errsendamount = true;
            this.totfee = 4.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.20).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "EUR") {

            this.errsendamount = true;
            this.totfee = 5.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.30).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "ZAR") {

            this.errsendamount = true;
            this.totfee = 99.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.60).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          }

        } else if (this.send_amount >= 501 && this.send_amount <= 9999) {

          if (this.sendcurrency == "USD") {

            this.errsendamount = true;
            this.totfee = 12.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.40).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "CAD") {

            this.errsendamount = true;
            this.totfee = 17.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.50).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "GBP") {

            this.errsendamount = true;
            this.totfee = 9.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.20).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "EUR") {

            this.errsendamount = true;
            this.totfee = 11.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.30).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "ZAR") {

            this.errsendamount = true;
            this.totfee = 197.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.60).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          }

        } else {

          this.errsendamount = true;
          this.totfee = (parseFloat(this.send_amount) * 1) / 100;
          this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

          if (this.sendcurrency == "USD") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.40).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "CAD") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.50).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "GBP") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.20).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "EUR") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.30).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "ZAR") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.60).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          }

        }
      } else {
        this.errsendamount = false;
        alertify.error("Please Enter Amount More Then 50");
      }

      if (this.errsendamount == true) {
        const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
        this.http.get(url).subscribe(
          (res: Response) => {
            this.getrs = res.json().result;
            this.get_amount = parseFloat(this.getrs).toFixed(2);
            this.final_get_amount = parseFloat(this.getrs).toFixed(2);
          });
      }
    }
  }

  sendchange = function (data) {

    let valid_digit = /^[0-9 ]*$/;

    if (data == "USD") {
      this.senddisflage = "us";
    } else if (data == "CAD") {
      this.senddisflage = "ca";
    } else if (data == "GBP") {
      this.senddisflage = "gb";
    } else if (data == "EUR") {
      this.senddisflage = "er";
    } else if (data == "ZAR") {
      this.senddisflage = "za";
    }

    let chksend_amount = valid_digit.test(this.send_amount);

    if (this.send_amount == "" || chksend_amount == false) {
      this.errsendamount = false;
      this.get_amount = "";
      alertify.error("Please Enter Valid Amount");
    } else {
      if (this.send_amount >= 50) {
        if (this.send_amount >= 50 && this.send_amount <= 500) {

          if (this.sendcurrency == "USD") {

            this.errsendamount = true;
            this.totfee = 6.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.40).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "CAD") {

            this.errsendamount = true;
            this.totfee = 9.50;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.50).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "GBP") {

            this.errsendamount = true;
            this.totfee = 4.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.20).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "EUR") {

            this.errsendamount = true;
            this.totfee = 5.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.30).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "ZAR") {

            this.errsendamount = true;
            this.totfee = 99.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.60).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          }

        } else if (this.send_amount >= 501 && this.send_amount <= 9999) {

          if (this.sendcurrency == "USD") {

            this.errsendamount = true;
            this.totfee = 12.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.40).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "CAD") {

            this.errsendamount = true;
            this.totfee = 17.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.50).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "GBP") {

            this.errsendamount = true;
            this.totfee = 9.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.20).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "EUR") {

            this.errsendamount = true;
            this.totfee = 11.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.30).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "ZAR") {

            this.errsendamount = true;
            this.totfee = 197.99;
            this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.60).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          }

        } else {

          this.errsendamount = true;
          this.totfee = (parseFloat(this.send_amount) * 1) / 100;
          this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

          if (this.sendcurrency == "USD") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.40).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "CAD") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.50).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "GBP") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.20).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "EUR") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.30).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          } else if (this.sendcurrency == "ZAR") {

            if (this.fee == "card_visa") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.60).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            } else if (this.fee == "card_amex") {

              this.vper = (this.totamount * 3.5) / 100;
              this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
              this.vtot = parseFloat(this.disfee).toFixed(2);
              this.vtotal = this.totamount - this.vtot;
              this.totamount = parseFloat(this.vtotal).toFixed(2);

            }

          }

        }
      } else {
        this.errsendamount = false;
        alertify.error("Please Enter Amount More Then 50");
      }
    }

    if (this.errsendamount == true) {
      const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
      this.http.get(url).subscribe(
        (res: Response) => {
          this.getrs = res.json().result;
          this.get_amount = parseFloat(this.getrs).toFixed(2);
          this.final_get_amount = parseFloat(this.getrs).toFixed(2);
        });
    }

  }

  getchange = function (data) {
    let valid_digit = /^[0-9. ]*$/;
    if (data == "USD") {
      this.getdisflage = "us";
    } else if (data == "CAD") {
      this.getdisflage = "ca";
    } else if (data == "GBP") {
      this.getdisflage = "gb";
    } else if (data == "EUR") {
      this.getdisflage = "er";
    } else if (data == "ZAR") {
      this.getdisflage = "za";
    }

    let chkget_amount = valid_digit.test(this.get_amount);

    if (this.get_amount == "" || chkget_amount == false) {
      this.errgetamount = false;
      this.send_amount = "";
      alertify.error("Please Enter Valid Amount");
    } else {
      this.errgetamount = true;
    }

    if (this.errgetamount == true) {
      const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
      this.http.get(url).subscribe(
        (res: Response) => {
          this.getrs = res.json().result;
          this.get_amount = parseFloat(this.getrs).toFixed(2);
          this.final_get_amount = parseFloat(this.getrs).toFixed(2);
        });
    }


  }

  sendmoney = function (data) {

    let valid_digit = /^[0-9. ]*$/;
    let chksend_amount = valid_digit.test(data.send_amount);
    let chkget_amount = valid_digit.test(data.get_amount);
    let chkfinal_get_amount = valid_digit.test(this.final_get_amount);

    if (data.send_amount == "" || chksend_amount == false) {
      this.errsendamount = false;
      alertify.error("Please Enter Send Amount");
    } else {
      this.errsendamount = true;
    }

    if (data.get_amount == "" || chkget_amount == false) {
      this.errgetamount = false;
      alertify.error("Please Enter Get Amount");
    } else {
      this.errgetamount = true;
    }

    if (this.final_get_amount == "" || chkfinal_get_amount == false) {
      this.errgetamount = false;
    } else {
      this.errgetamount = true;
    }

    if (data.fee == 'card_visa') {
      this.visfee = this.disfee;
    } else {
      this.visfee = "";
    }

    if (data.fee == 'card_amex') {
      this.amxfee = this.disfee;
    } else {
      this.amxfee = "";
    }

    if (this.errsendamount == true && this.errgetamount == true) {

      var finaldata = {
        "custid": this.custid,
        "send_amount": data.send_amount,
        "send_currency": data.sendcurrency,
        "get_amount": data.get_amount,
        "get_currency": data.getcurrency,
        "fee": this.totfee,
        "amount": this.totamount,
        "visafee": this.visfee,
        "amexfee": this.amxfee
      }

      const url = `${this.hosturl + this.port + "/one/send_money"}`;
      this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {

            var upsid = CryptoJS.AES.encrypt(JSON.stringify(res.json().sid), 'Zipcoin');
            localStorage.setItem("sendid", upsid.toString());

            // var stripamount = this.send_amount;
            var stripamount = this.send_amount * 100;


            var upsend_money = CryptoJS.AES.encrypt(JSON.stringify(stripamount), 'Zipcoin');
            localStorage.setItem("send_amount", upsend_money.toString());

            var upsend_currency = CryptoJS.AES.encrypt(JSON.stringify(this.sendcurrency), 'Zipcoin');
            localStorage.setItem("send_currency", upsend_currency.toString());

            this.router.navigate(['./send-money-two']);
          }
        })

    }

  }

  upsendmoney = function (data) {

    let valid_digit = /^[0-9. ]*$/;
    let chksend_amount = valid_digit.test(data.send_amount);
    let chkget_amount = valid_digit.test(data.get_amount);
    let chkfinal_get_amount = valid_digit.test(this.final_get_amount);

    if (data.send_amount == "" || chksend_amount == false) {
      this.errsendamount = false;
      alertify.error("Please Enter Send Amount");
    } else {
      this.errsendamount = true;
    }

    if (data.get_amount == "" || chkget_amount == false) {
      this.errgetamount = false;
      alertify.error("Please Enter Get Amount");
    } else {
      this.errgetamount = true;
    }

    if (this.final_get_amount == "" || chkfinal_get_amount == false) {
      this.errgetamount = false;
    } else {
      this.errgetamount = true;
    }

    if (data.fee == 'card_visa') {
      this.visfee = this.disfee;
    } else {
      this.visfee = "";
    }

    if (data.fee == 'card_amex') {
      this.amxfee = this.disfee;
    } else {
      this.amxfee = "";
    }

    if (this.errsendamount == true && this.errgetamount == true) {

      var finaldata = {
        "sendid": this.upform,
        "send_amount": data.send_amount,
        "send_currency": data.sendcurrency,
        "get_amount": data.get_amount,
        "get_currency": data.getcurrency,
        "fee": this.totfee,
        "amount": this.totamount,
        "visafee": this.visfee,
        "amexfee": this.amxfee
      }

      const url = `${this.hosturl + this.port + "/one/upsend_money"}`;
      this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {

            var stripamount = this.send_amount * 100;

            var upsend_money = CryptoJS.AES.encrypt(JSON.stringify(stripamount), 'Zipcoin');
            localStorage.setItem("send_amount", upsend_money.toString());

            var upsend_currency = CryptoJS.AES.encrypt(JSON.stringify(this.sendcurrency), 'Zipcoin');
            localStorage.setItem("send_currency", upsend_currency.toString());

            this.router.navigate(['./send-money-two']);
          }
        })

    }

  }

  calculate = function (data) {

    if (this.sendcurrency == "USD") {

      this.errsendamount = true;
      this.totfee = 6.99;
      this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

      if (this.fee == "card_visa") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.40).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      } else if (this.fee == "card_amex") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      }

    } else if (this.sendcurrency == "CAD") {

      this.errsendamount = true;
      this.totfee = 9.50;
      this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

      if (this.fee == "card_visa") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.50).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      } else if (this.fee == "card_amex") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      }

    } else if (this.sendcurrency == "GBP") {

      this.errsendamount = true;
      this.totfee = 4.99;
      this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

      if (this.fee == "card_visa") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.20).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      } else if (this.fee == "card_amex") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      }

    } else if (this.sendcurrency == "EUR") {

      this.errsendamount = true;
      this.totfee = 5.99;
      this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

      if (this.fee == "card_visa") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.30).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      } else if (this.fee == "card_amex") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      }

    } else if (this.sendcurrency == "ZAR") {

      this.errsendamount = true;
      this.totfee = 99.99;
      this.totamount = parseFloat(this.send_amount) - parseFloat(this.totfee);

      if (this.fee == "card_visa") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.60).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      } else if (this.fee == "card_amex") {

        this.vper = (this.totamount * 3.5) / 100;
        this.disfee = parseFloat(this.vper + 0.80).toFixed(2);
        this.vtot = parseFloat(this.disfee).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.totamount = parseFloat(this.vtotal).toFixed(2);

      }

    }

    const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
    this.http.get(url).subscribe(
      (res: Response) => {
        this.getrs = res.json().result;
        this.get_amount = parseFloat(this.getrs).toFixed(2);
        this.final_get_amount = parseFloat(this.getrs).toFixed(2);
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

        this.fee = "card_visa";
        this.disfee = 0;


        let decryptedData_upform = localStorage.getItem('sendid');

        if (decryptedData_upform != null) {
          var bytes_upform = CryptoJS.AES.decrypt(decryptedData_upform.toString(), 'Zipcoin');
          this.upform = JSON.parse(bytes_upform.toString(CryptoJS.enc.Utf8));

          const gettrasferdata = `${this.hosturl + this.port + "/getsend_money_data/"}${this.upform}`;
          this.http.get(gettrasferdata).subscribe(
            (res: Response) => {
              this.transdata = res.json().transfer;

              this.view = true;

              this.sendcurrency = this.transdata[0].send_currency;
              if (this.sendcurrency == "USD") {
                this.senddisflage = "us";
              } else if (this.sendcurrency == "CAD") {
                this.senddisflage = "ca";
              } else if (this.sendcurrency == "GBP") {
                this.senddisflage = "gb";
              } else if (this.sendcurrency == "EUR") {
                this.senddisflage = "er";
              } else if (this.sendcurrency == "ZAR") {
                this.senddisflage = "za";
              }

              this.getcurrency = this.transdata[0].get_currency;
              if (this.getcurrency == "USD") {
                this.getdisflage = "us";
              } else if (this.getcurrency == "CAD") {
                this.getdisflage = "ca";
              } else if (this.getcurrency == "GBP") {
                this.getdisflage = "gb";
              } else if (this.getcurrency == "EUR") {
                this.getdisflage = "er";
              } else if (this.getcurrency == "ZAR") {
                this.getdisflage = "za";
              }

              this.send_amount = this.transdata[0].send_amount;
              this.getrs = this.transdata[0].get_amount;
              this.get_amount = parseFloat(this.getrs).toFixed(2);
              this.final_get_amount = parseFloat(this.getrs).toFixed(2);

              this.totfee = this.transdata[0].total_fee;
              this.totamount = this.transdata[0].total_amount;

              let disvisafee = this.transdata[0].visa_mc_fee;
              if (disvisafee != "") {
                this.disfee = disvisafee;
                this.fee = "card_visa";
              }

              let disamexfee = this.transdata[0].amex_fee;
              if (disamexfee != "") {
                this.disfee = disamexfee;
                this.fee = "card_amex";
              }

              this.errsendamount = true;
              this.errgetamount = true;

            });

        } else {
          this.view = false;

          this.sendcurrency = "USD";
          this.senddisflage = "us";

          this.getcurrency = "CAD";
          this.getdisflage = "ca";

          this.totfee = 0;
          this.totamount = 0;

          this.errsendamount = true;
          this.errgetamount = true;

          this.send_amount = "";
          this.get_amount = "";
        }

      }
    } else {
      this.router.navigate(['/login']);
    }



  }

}
