import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-send-money-three',
  templateUrl: './send-money-three.component.html',
  styleUrls: ['./send-money-three.component.css']
})
export class SendMoneyThreeComponent implements OnInit {
  rdoagent: any;

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  recipientdata: any;
  rdobenificiary: any;

  fullname: any;
  ifsc_code: any;
  account_number: any;

  errfullname: any;
  errifsc_code: any;
  erraccount_number: any;

  countryname: any;
  country: any;

  statename: any;
  state: any;

  cityname: any;
  city: any;

  email: any;
  account_name: any;
  else_ifsc_code: any;
  else_account_number: any;

  erremail: any;
  erraccount_name: any;
  errcountry: any;
  errstate: any;
  errcity: any;
  errelse_ifsc_code: any;
  errelse_account_number: any;

  errtransreason: any;
  errrecipient: any;

  transfer_reason: any;

  selfcss: any;
  elsecss: any;

  transdata: any;

  upform: any;
  showres: any;
  ttype: any;
  showagent: any;

  phonecode: any;
  agentdetails: any;
  bank_transfer: boolean;
  cash_pick_up: boolean;
  mobile_top_up: boolean;

  errrecname: any;
  errrecaddress: any;
  errreccountry: any;
  errrecstate: any;
  errreccity: any;
  errrecphone: any;
  errrecemail: any;

  recname: any;
  recaddress: any;
  reccountry: any;
  recstate: any;
  reccity: any;
  recphone: any;
  recemail: any;

  beni: any;

  benifcountry: any;
  currency: any;

  errrectype: any;
  errholder: any;
  errcurrency: any;

  errbankcountry: any;
  errroutingno: any;
  errus_accountno: any;
  errus_accounttype: any;
  errinstino: any;
  errtransitno: any;
  errca_accountno: any;
  errca_accounttype: any;
  errgb_accountno: any;
  erruksortcode: any;
  errza_bankname: any;
  errza_phoneno: any;
  errza_accountno: any;
  errer_iban: any;


  fields: any;
  formdata: any;

  text: any;

  us: any;
  ca: any;
  gb: any;
  za: any;
  er: any;

  bankcountry: any;

  disflage: any;

  phone: any;
  errphone: any;
  phone_code: any;

  address: any;
  erraddress: any;
  airtime_top_up: boolean;
  gift_card: boolean;
  zipco_wallet: boolean;
  errcomemail: boolean;
  comemail: string;

  chkverify: any;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  countrystate = function (cid) {

    if (cid != "") {
      const countrycode = `${this.hosturl + this.port + "/chk_code/"}${cid}`;
      this.http.get(countrycode).subscribe(
        (res: Response) => {
          this.phonecode = res.json().code;
        }
      )
    } else {
      this.phonecode = "";
    }

    if (cid != "") {
      const getstate = `${this.hosturl + this.port + "/state/"}${cid}`;
      this.http.get(getstate).subscribe(
        (res: Response) => {
          this.statename = res.json().state;
        }
      )
    }

  }

  statecity = function (sid) {

    if (sid != "") {
      const getcity = `${this.hosturl + this.port + "/city/"}${sid}`;
      this.http.get(getcity).subscribe(
        (res: Response) => {
          this.cityname = res.json().city;
        }
      )
    }
  }

  previous = function () {
    this.router.navigate(['./send-money-two']);
  }

  recipient = function (data) {

    if (data != "myrecipient") {
      this.rdobenificiary = "";
    }

    if (data == 'self') {
      this.selfcss = true;
      this.elsecss = false;
    } else if (data == 'someelse') {
      this.selfcss = false;
      this.elsecss = true;
    }

    var type = CryptoJS.AES.encrypt(JSON.stringify(data), 'Zipcoin');
    localStorage.setItem("recipient", type.toString());
  }

  checkvalid_account = function () {

    let valid_digit = /^[0-9 ]*$/;
    let chkaccount = valid_digit.test(this.account_number);

    if (chkaccount == false) {
      this.erraccount_number = false;
      alertify.error("Please Enter Valid Account Number");
    }

  }

  checkvalid_phone = function (data) {

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(data);

    if (chkphone == false) {
      this.errphone = false;
      alertify.error("Please Enter Valid Phone Number");
    }

  }

  addself = function (data) {

    let val_ifscode = /^[a-zA-Z0-9 ]*$/;
    let chkifscode = val_ifscode.test(data.ifsc_code);
    let chkaccount_number = val_ifscode.test(data.account_number);

    if (data.fullname == "") {
      this.errfullname = false;
      alertify.error("Please Enter Full Name Of The Account Holder");
    } else {
      this.errfullname = true;
    }

    if (data.ifsc_code == "" || chkifscode == false) {
      this.errifsc_code = false;
      alertify.error("Please Enter Valid IFSC Code");
    } else {
      this.errifsc_code = true;
    }

    if (data.account_number == "" || chkaccount_number == false) {
      this.erraccount_number = false;
      alertify.error("Please Enter Valid Account Number");
    } else {
      this.erraccount_number = true;
    }

    if (this.errfullname == true && this.errifsc_code == true && this.erraccount_number == true) {

      var type_fullname = CryptoJS.AES.encrypt(JSON.stringify(data.fullname), 'Zipcoin');
      localStorage.setItem("fullname", type_fullname.toString());

      var type_ifsc_code = CryptoJS.AES.encrypt(JSON.stringify(data.ifsc_code), 'Zipcoin');
      localStorage.setItem("ifsc_code", type_ifsc_code.toString());

      var type_account_number = CryptoJS.AES.encrypt(JSON.stringify(data.account_number), 'Zipcoin');
      localStorage.setItem("account_number", type_account_number.toString());

      localStorage.removeItem("email");
      localStorage.removeItem("account_name");
      localStorage.removeItem("country");
      localStorage.removeItem("state");
      localStorage.removeItem("city");
      localStorage.removeItem("else_ifsc_code");
      localStorage.removeItem("else_account_number");
      this.rdobenificiary == "";
      this.close_self();

    }

  }

  some_else = function (data) {

    let val_ifscode = /^[a-zA-Z0-9 ]*$/;
    let chkelse_ifsc_code = val_ifscode.test(data.else_ifsc_code);
    let chkelse_account_number = val_ifscode.test(data.else_account_number);

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chkemail = valid_email.test(data.email);

    if (data.email == "" || chkemail == false) {
      this.erremail = false;
      alertify.error("Please Enter Valid Email");
    } else {
      this.erremail = true;
    }

    if (data.account_name == "") {
      this.erraccount_name = false;
      alertify.error("Please Enter Full Name Of The Account Holder");
    } else {
      this.erraccount_name = true;
    }

    if (data.country == "") {
      this.errcountry = false;
      alertify.error("Please Select Country Name");
    } else {
      this.errcountry = true;
    }

    if (data.state == "") {
      this.errstate = false;
      alertify.error("Please Select State Name");
    } else {
      this.errstate = true;
    }

    if (data.city == "") {
      this.errcity = false;
      alertify.error("Please Select City Name");
    } else {
      this.errcity = true;
    }

    if (data.else_ifsc_code == "" || chkelse_ifsc_code == false) {
      this.errelse_ifsc_code = false;
      alertify.error("Please Enter Valid IFSC Code");
    } else {
      this.errelse_ifsc_code = true;
    }

    if (data.else_account_number == "" || chkelse_account_number == false) {
      this.errelse_account_number = false;
      alertify.error("Please Enter Valid Account Number");
    } else {
      this.errelse_account_number = true;
    }

    if (this.erremail == true && this.erraccount_name == true && this.errcountry == true && this.errstate == true
      && this.errcity == true && this.errelse_ifsc_code == true && this.errelse_account_number == true) {

      var type_email = CryptoJS.AES.encrypt(JSON.stringify(data.email), 'Zipcoin');
      localStorage.setItem("email", type_email.toString());

      var type_account_name = CryptoJS.AES.encrypt(JSON.stringify(data.account_name), 'Zipcoin');
      localStorage.setItem("account_name", type_account_name.toString());

      var type_country = CryptoJS.AES.encrypt(JSON.stringify(data.country), 'Zipcoin');
      localStorage.setItem("country", type_country.toString());

      var type_state = CryptoJS.AES.encrypt(JSON.stringify(data.state), 'Zipcoin');
      localStorage.setItem("state", type_state.toString());

      var type_city = CryptoJS.AES.encrypt(JSON.stringify(data.city), 'Zipcoin');
      localStorage.setItem("city", type_city.toString());

      var type_else_ifsc_code = CryptoJS.AES.encrypt(JSON.stringify(data.else_ifsc_code), 'Zipcoin');
      localStorage.setItem("else_ifsc_code", type_else_ifsc_code.toString());

      var type_else_account_number = CryptoJS.AES.encrypt(JSON.stringify(data.else_account_number), 'Zipcoin');
      localStorage.setItem("else_account_number", type_else_account_number.toString());

      localStorage.removeItem("fullname");
      localStorage.removeItem("ifsc_code");
      localStorage.removeItem("account_number");
      this.rdobenificiary == "";
      this.close_else()
    }

  }

  sendmoney = function (data) {

    let decryptedData_type = localStorage.getItem('transfer_type');
    var bytes_type = CryptoJS.AES.decrypt(decryptedData_type.toString(), 'Zipcoin');
    let trans_type = JSON.parse(bytes_type.toString(CryptoJS.enc.Utf8));

    if (data.transfer_reason == "") {
      this.errtransreason = false;
      alertify.error("Please Select Transfer Reason");
    } else {
      this.errtransreason = true;
    }


    if (trans_type == "bank transfer") {

      let decryptedData_recipient = localStorage.getItem('recipient');

      if (decryptedData_recipient == null) {
        this.errrecipient = false;
        alertify.error("Please select any one recipient");
      } else {
        this.errrecipient = true;
      }

      if (this.rdobenificiary != "") {
        localStorage.removeItem("fullname");
        localStorage.removeItem("ifsc_code");
        localStorage.removeItem("account_number");

        localStorage.removeItem("email");
        localStorage.removeItem("account_name");
        localStorage.removeItem("country");
        localStorage.removeItem("state");
        localStorage.removeItem("city");
        localStorage.removeItem("else_ifsc_code");
        localStorage.removeItem("else_account_number");
      }

      if (this.errtransreason == true && this.errrecipient == true) {

        var bytesrecipient = CryptoJS.AES.decrypt(decryptedData_recipient.toString(), 'Zipcoin');
        var recipient = JSON.parse(bytesrecipient.toString(CryptoJS.enc.Utf8));

        let decryptedData_fullname = localStorage.getItem('fullname');
        if (decryptedData_fullname != null) {
          var bytesfullname = CryptoJS.AES.decrypt(decryptedData_fullname.toString(), 'Zipcoin');
          var fullname = JSON.parse(bytesfullname.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_ifsc_code = localStorage.getItem('ifsc_code');
        if (decryptedData_ifsc_code != null) {
          var bytesifsc_code = CryptoJS.AES.decrypt(decryptedData_ifsc_code.toString(), 'Zipcoin');
          var ifsc_code = JSON.parse(bytesifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_number = localStorage.getItem('account_number');
        if (decryptedData_account_number != null) {
          var bytesaccount_number = CryptoJS.AES.decrypt(decryptedData_account_number.toString(), 'Zipcoin');
          var account_number = JSON.parse(bytesaccount_number.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_email = localStorage.getItem('email');
        if (decryptedData_email != null) {
          var bytesemail = CryptoJS.AES.decrypt(decryptedData_email.toString(), 'Zipcoin');
          var email = JSON.parse(bytesemail.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_name = localStorage.getItem('account_name');
        if (decryptedData_account_name != null) {
          var bytesaccount_name = CryptoJS.AES.decrypt(decryptedData_account_name.toString(), 'Zipcoin');
          var account_name = JSON.parse(bytesaccount_name.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_country = localStorage.getItem('country');
        if (decryptedData_country != null) {
          var bytescountry = CryptoJS.AES.decrypt(decryptedData_country.toString(), 'Zipcoin');
          var country = JSON.parse(bytescountry.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_state = localStorage.getItem('state');
        if (decryptedData_state != null) {
          var bytesstate = CryptoJS.AES.decrypt(decryptedData_state.toString(), 'Zipcoin');
          var state = JSON.parse(bytesstate.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_city = localStorage.getItem('city');
        if (decryptedData_city != null) {
          var bytescity = CryptoJS.AES.decrypt(decryptedData_city.toString(), 'Zipcoin');
          var city = JSON.parse(bytescity.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_ifsc_code = localStorage.getItem('else_ifsc_code');
        if (decryptedData_else_ifsc_code != null) {
          var byteselse_ifsc_code = CryptoJS.AES.decrypt(decryptedData_else_ifsc_code.toString(), 'Zipcoin');
          var else_ifsc_code = JSON.parse(byteselse_ifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_account_number = localStorage.getItem('else_account_number');
        if (decryptedData_else_account_number != null) {
          var byteselse_account_number = CryptoJS.AES.decrypt(decryptedData_else_account_number.toString(), 'Zipcoin');
          var else_account_number = JSON.parse(byteselse_account_number.toString(CryptoJS.enc.Utf8));
        }

        var finalthree = {
          "sendid": this.upform,
          "benificiary_id": (this.rdobenificiary) ? this.rdobenificiary : "",
          "benificiary_type": (recipient) ? recipient : "",
          "email": (email) ? email : "",
          "self_account_holder": (fullname) ? fullname : "",
          "else_account_holder": (account_name) ? account_name : "",
          "country": (country) ? country : "",
          "state": (state) ? state : "",
          "city": (city) ? city : "",
          "self_ifsc_code": (ifsc_code) ? ifsc_code : "",
          "else_ifsc_code": (else_ifsc_code) ? else_ifsc_code : "",
          "self_account_number": (account_number) ? account_number : "",
          "else_account_number": (else_account_number) ? else_account_number : "",
          "transfer_reason": data.transfer_reason,
        }

        const url = `${this.hosturl + this.port + "/three/send_money"}`;
        this.http.post(url, JSON.stringify(finalthree), { headers: this.headers }).toPromise()
          .then((res: Response) => {
            if (res.json().success) {
              localStorage.removeItem("recipient");
              this.router.navigate(['./send-money-four']);
            }
          })

      }

    } else if (trans_type == "cash pick-up") {

      let valid_name = /^[a-zA-Z ]*$/;
      let chkname = valid_name.test(data.recname);

      let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      let chkemail = valid_email.test(data.recemail);

      let valid_digit = /^[0-9 ]*$/;
      let chkphone = valid_digit.test(data.recphone);


      let decryptedData_recipient = localStorage.getItem('recipient');

      if (decryptedData_recipient == null) {
        this.errrecipient = false;
        alertify.error("Please Select Agent Name");
      } else {
        this.errrecipient = true;
      }

      if (data.recname == "" || chkname == false) {
        this.errrecname = false;
        alertify.error("Please Enter Valid Name");
      } else {
        this.errrecname = true;
      }

      if (data.recaddress == "") {
        this.errrecaddress = false;
        alertify.error("Please Enter Address");
      } else {
        this.errrecaddress = true;
      }

      if (data.reccountry == "") {
        this.errreccountry = false;
        alertify.error("Please Select Country Name");
      } else {
        this.errreccountry = true;
      }

      if (data.recstate == "") {
        this.errrecstate = false;
        alertify.error("Please Select State Name");
      } else {
        this.errrecstate = true;
      }

      if (data.reccity == "") {
        this.errreccity = false;
        alertify.error("Please Select City Name");
      } else {
        this.errreccity = true;
      }

      if (data.recphone == "" || chkphone == false) {
        this.errrecphone = false;
        alertify.error("Please Enter Valid Phone Number");
      } else {
        this.errrecphone = true;
      }

      if (data.recemail == "" || chkemail == false) {
        this.errrecemail = false;
        alertify.error("Please Enter Valid Email");
      } else {
        this.errrecemail = true;
      }


      if (this.errrecipient == true && this.errrecname == true &&
        this.errrecaddress == true && this.errreccountry == true && this.errrecstate == true
        && this.errreccity == true && this.errrecphone == true && this.errrecemail == true
        && this.errtransreason == true) {

        var bytesrecipient = CryptoJS.AES.decrypt(decryptedData_recipient.toString(), 'Zipcoin');
        var recipient = JSON.parse(bytesrecipient.toString(CryptoJS.enc.Utf8));

        var cashpickup = {
          "sendid": this.upform,
          "benificiary_id": 0,
          "benificiary_type": recipient,
          "email": "",
          "self_account_holder": "",
          "else_account_holder": "",
          "country": "",
          "state": "",
          "city": "",
          "self_ifsc_code": "",
          "else_ifsc_code": "",
          "self_account_number": "",
          "else_account_number": "",
          "agentid": data.rdoagent,
          "recemail": data.recemail,
          "recname": data.recname,
          "recaddress": data.recaddress,
          "reccountry": data.reccountry,
          "recstate": data.recstate,
          "reccity": data.reccity,
          "recphone": data.recphone,
          "transfer_reason": data.transfer_reason,
        }

        const url = `${this.hosturl + this.port + "/three/send_money"}`;
        this.http.post(url, JSON.stringify(cashpickup), { headers: this.headers }).toPromise()
          .then((res: Response) => {
            if (res.json().success) {
              localStorage.removeItem("recipient");
              this.router.navigate(['./send-money-four']);
            }
          })

      }


    } else if (trans_type == "mobile top-up") {

      let decryptedData_recipient = localStorage.getItem('recipient');

      if (decryptedData_recipient == null) {
        this.errrecipient = false;
        alertify.error("Please select any one recipient");
      } else {
        this.errrecipient = true;
      }

      if (this.rdobenificiary != "") {
        localStorage.removeItem("fullname");
        localStorage.removeItem("ifsc_code");
        localStorage.removeItem("account_number");

        localStorage.removeItem("email");
        localStorage.removeItem("account_name");
        localStorage.removeItem("country");
        localStorage.removeItem("state");
        localStorage.removeItem("city");
        localStorage.removeItem("else_ifsc_code");
        localStorage.removeItem("else_account_number");
      }

      if (this.errtransreason == true && this.errrecipient == true) {

        var bytesrecipient = CryptoJS.AES.decrypt(decryptedData_recipient.toString(), 'Zipcoin');
        var recipient = JSON.parse(bytesrecipient.toString(CryptoJS.enc.Utf8));

        let decryptedData_fullname = localStorage.getItem('fullname');
        if (decryptedData_fullname != null) {
          var bytesfullname = CryptoJS.AES.decrypt(decryptedData_fullname.toString(), 'Zipcoin');
          var fullname = JSON.parse(bytesfullname.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_ifsc_code = localStorage.getItem('ifsc_code');
        if (decryptedData_ifsc_code != null) {
          var bytesifsc_code = CryptoJS.AES.decrypt(decryptedData_ifsc_code.toString(), 'Zipcoin');
          var ifsc_code = JSON.parse(bytesifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_number = localStorage.getItem('account_number');
        if (decryptedData_account_number != null) {
          var bytesaccount_number = CryptoJS.AES.decrypt(decryptedData_account_number.toString(), 'Zipcoin');
          var account_number = JSON.parse(bytesaccount_number.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_email = localStorage.getItem('email');
        if (decryptedData_email != null) {
          var bytesemail = CryptoJS.AES.decrypt(decryptedData_email.toString(), 'Zipcoin');
          var email = JSON.parse(bytesemail.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_name = localStorage.getItem('account_name');
        if (decryptedData_account_name != null) {
          var bytesaccount_name = CryptoJS.AES.decrypt(decryptedData_account_name.toString(), 'Zipcoin');
          var account_name = JSON.parse(bytesaccount_name.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_country = localStorage.getItem('country');
        if (decryptedData_country != null) {
          var bytescountry = CryptoJS.AES.decrypt(decryptedData_country.toString(), 'Zipcoin');
          var country = JSON.parse(bytescountry.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_state = localStorage.getItem('state');
        if (decryptedData_state != null) {
          var bytesstate = CryptoJS.AES.decrypt(decryptedData_state.toString(), 'Zipcoin');
          var state = JSON.parse(bytesstate.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_city = localStorage.getItem('city');
        if (decryptedData_city != null) {
          var bytescity = CryptoJS.AES.decrypt(decryptedData_city.toString(), 'Zipcoin');
          var city = JSON.parse(bytescity.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_ifsc_code = localStorage.getItem('else_ifsc_code');
        if (decryptedData_else_ifsc_code != null) {
          var byteselse_ifsc_code = CryptoJS.AES.decrypt(decryptedData_else_ifsc_code.toString(), 'Zipcoin');
          var else_ifsc_code = JSON.parse(byteselse_ifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_account_number = localStorage.getItem('else_account_number');
        if (decryptedData_else_account_number != null) {
          var byteselse_account_number = CryptoJS.AES.decrypt(decryptedData_else_account_number.toString(), 'Zipcoin');
          var else_account_number = JSON.parse(byteselse_account_number.toString(CryptoJS.enc.Utf8));
        }

        var finalthree = {
          "sendid": this.upform,
          "benificiary_id": (this.rdobenificiary) ? this.rdobenificiary : "",
          "benificiary_type": (recipient) ? recipient : "",
          "email": (email) ? email : "",
          "self_account_holder": (fullname) ? fullname : "",
          "else_account_holder": (account_name) ? account_name : "",
          "country": (country) ? country : "",
          "state": (state) ? state : "",
          "city": (city) ? city : "",
          "self_ifsc_code": (ifsc_code) ? ifsc_code : "",
          "else_ifsc_code": (else_ifsc_code) ? else_ifsc_code : "",
          "self_account_number": (account_number) ? account_number : "",
          "else_account_number": (else_account_number) ? else_account_number : "",
          "transfer_reason": data.transfer_reason,
        }

        const url = `${this.hosturl + this.port + "/three/send_money"}`;
        this.http.post(url, JSON.stringify(finalthree), { headers: this.headers }).toPromise()
          .then((res: Response) => {
            if (res.json().success) {
              localStorage.removeItem("recipient");
              this.router.navigate(['./send-money-four']);
            }
          })

      }

    } else if (trans_type == "airtime top-up") {

      let decryptedData_recipient = localStorage.getItem('recipient');

      if (decryptedData_recipient == null) {
        this.errrecipient = false;
        alertify.error("Please select any one recipient");
      } else {
        this.errrecipient = true;
      }

      if (this.rdobenificiary != "") {
        localStorage.removeItem("fullname");
        localStorage.removeItem("ifsc_code");
        localStorage.removeItem("account_number");

        localStorage.removeItem("email");
        localStorage.removeItem("account_name");
        localStorage.removeItem("country");
        localStorage.removeItem("state");
        localStorage.removeItem("city");
        localStorage.removeItem("else_ifsc_code");
        localStorage.removeItem("else_account_number");
      }

      if (this.errtransreason == true && this.errrecipient == true) {

        var bytesrecipient = CryptoJS.AES.decrypt(decryptedData_recipient.toString(), 'Zipcoin');
        var recipient = JSON.parse(bytesrecipient.toString(CryptoJS.enc.Utf8));

        let decryptedData_fullname = localStorage.getItem('fullname');
        if (decryptedData_fullname != null) {
          var bytesfullname = CryptoJS.AES.decrypt(decryptedData_fullname.toString(), 'Zipcoin');
          var fullname = JSON.parse(bytesfullname.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_ifsc_code = localStorage.getItem('ifsc_code');
        if (decryptedData_ifsc_code != null) {
          var bytesifsc_code = CryptoJS.AES.decrypt(decryptedData_ifsc_code.toString(), 'Zipcoin');
          var ifsc_code = JSON.parse(bytesifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_number = localStorage.getItem('account_number');
        if (decryptedData_account_number != null) {
          var bytesaccount_number = CryptoJS.AES.decrypt(decryptedData_account_number.toString(), 'Zipcoin');
          var account_number = JSON.parse(bytesaccount_number.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_email = localStorage.getItem('email');
        if (decryptedData_email != null) {
          var bytesemail = CryptoJS.AES.decrypt(decryptedData_email.toString(), 'Zipcoin');
          var email = JSON.parse(bytesemail.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_name = localStorage.getItem('account_name');
        if (decryptedData_account_name != null) {
          var bytesaccount_name = CryptoJS.AES.decrypt(decryptedData_account_name.toString(), 'Zipcoin');
          var account_name = JSON.parse(bytesaccount_name.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_country = localStorage.getItem('country');
        if (decryptedData_country != null) {
          var bytescountry = CryptoJS.AES.decrypt(decryptedData_country.toString(), 'Zipcoin');
          var country = JSON.parse(bytescountry.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_state = localStorage.getItem('state');
        if (decryptedData_state != null) {
          var bytesstate = CryptoJS.AES.decrypt(decryptedData_state.toString(), 'Zipcoin');
          var state = JSON.parse(bytesstate.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_city = localStorage.getItem('city');
        if (decryptedData_city != null) {
          var bytescity = CryptoJS.AES.decrypt(decryptedData_city.toString(), 'Zipcoin');
          var city = JSON.parse(bytescity.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_ifsc_code = localStorage.getItem('else_ifsc_code');
        if (decryptedData_else_ifsc_code != null) {
          var byteselse_ifsc_code = CryptoJS.AES.decrypt(decryptedData_else_ifsc_code.toString(), 'Zipcoin');
          var else_ifsc_code = JSON.parse(byteselse_ifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_account_number = localStorage.getItem('else_account_number');
        if (decryptedData_else_account_number != null) {
          var byteselse_account_number = CryptoJS.AES.decrypt(decryptedData_else_account_number.toString(), 'Zipcoin');
          var else_account_number = JSON.parse(byteselse_account_number.toString(CryptoJS.enc.Utf8));
        }

        var finalthree = {
          "sendid": this.upform,
          "benificiary_id": (this.rdobenificiary) ? this.rdobenificiary : "",
          "benificiary_type": (recipient) ? recipient : "",
          "email": (email) ? email : "",
          "self_account_holder": (fullname) ? fullname : "",
          "else_account_holder": (account_name) ? account_name : "",
          "country": (country) ? country : "",
          "state": (state) ? state : "",
          "city": (city) ? city : "",
          "self_ifsc_code": (ifsc_code) ? ifsc_code : "",
          "else_ifsc_code": (else_ifsc_code) ? else_ifsc_code : "",
          "self_account_number": (account_number) ? account_number : "",
          "else_account_number": (else_account_number) ? else_account_number : "",
          "transfer_reason": data.transfer_reason,
        }

        const url = `${this.hosturl + this.port + "/three/send_money"}`;
        this.http.post(url, JSON.stringify(finalthree), { headers: this.headers }).toPromise()
          .then((res: Response) => {
            if (res.json().success) {
              localStorage.removeItem("recipient");
              this.router.navigate(['./send-money-four']);
            }
          })

      }

    } else if (trans_type == "gift card") {

      let decryptedData_recipient = localStorage.getItem('recipient');

      if (decryptedData_recipient == null) {
        this.errrecipient = false;
        alertify.error("Please select any one recipient");
      } else {
        this.errrecipient = true;
      }

      if (this.rdobenificiary != "") {
        localStorage.removeItem("fullname");
        localStorage.removeItem("ifsc_code");
        localStorage.removeItem("account_number");

        localStorage.removeItem("email");
        localStorage.removeItem("account_name");
        localStorage.removeItem("country");
        localStorage.removeItem("state");
        localStorage.removeItem("city");
        localStorage.removeItem("else_ifsc_code");
        localStorage.removeItem("else_account_number");
      }

      if (this.errtransreason == true && this.errrecipient == true) {

        var bytesrecipient = CryptoJS.AES.decrypt(decryptedData_recipient.toString(), 'Zipcoin');
        var recipient = JSON.parse(bytesrecipient.toString(CryptoJS.enc.Utf8));

        let decryptedData_fullname = localStorage.getItem('fullname');
        if (decryptedData_fullname != null) {
          var bytesfullname = CryptoJS.AES.decrypt(decryptedData_fullname.toString(), 'Zipcoin');
          var fullname = JSON.parse(bytesfullname.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_ifsc_code = localStorage.getItem('ifsc_code');
        if (decryptedData_ifsc_code != null) {
          var bytesifsc_code = CryptoJS.AES.decrypt(decryptedData_ifsc_code.toString(), 'Zipcoin');
          var ifsc_code = JSON.parse(bytesifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_number = localStorage.getItem('account_number');
        if (decryptedData_account_number != null) {
          var bytesaccount_number = CryptoJS.AES.decrypt(decryptedData_account_number.toString(), 'Zipcoin');
          var account_number = JSON.parse(bytesaccount_number.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_email = localStorage.getItem('email');
        if (decryptedData_email != null) {
          var bytesemail = CryptoJS.AES.decrypt(decryptedData_email.toString(), 'Zipcoin');
          var email = JSON.parse(bytesemail.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_name = localStorage.getItem('account_name');
        if (decryptedData_account_name != null) {
          var bytesaccount_name = CryptoJS.AES.decrypt(decryptedData_account_name.toString(), 'Zipcoin');
          var account_name = JSON.parse(bytesaccount_name.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_country = localStorage.getItem('country');
        if (decryptedData_country != null) {
          var bytescountry = CryptoJS.AES.decrypt(decryptedData_country.toString(), 'Zipcoin');
          var country = JSON.parse(bytescountry.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_state = localStorage.getItem('state');
        if (decryptedData_state != null) {
          var bytesstate = CryptoJS.AES.decrypt(decryptedData_state.toString(), 'Zipcoin');
          var state = JSON.parse(bytesstate.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_city = localStorage.getItem('city');
        if (decryptedData_city != null) {
          var bytescity = CryptoJS.AES.decrypt(decryptedData_city.toString(), 'Zipcoin');
          var city = JSON.parse(bytescity.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_ifsc_code = localStorage.getItem('else_ifsc_code');
        if (decryptedData_else_ifsc_code != null) {
          var byteselse_ifsc_code = CryptoJS.AES.decrypt(decryptedData_else_ifsc_code.toString(), 'Zipcoin');
          var else_ifsc_code = JSON.parse(byteselse_ifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_account_number = localStorage.getItem('else_account_number');
        if (decryptedData_else_account_number != null) {
          var byteselse_account_number = CryptoJS.AES.decrypt(decryptedData_else_account_number.toString(), 'Zipcoin');
          var else_account_number = JSON.parse(byteselse_account_number.toString(CryptoJS.enc.Utf8));
        }

        var finalthree = {
          "sendid": this.upform,
          "benificiary_id": (this.rdobenificiary) ? this.rdobenificiary : "",
          "benificiary_type": (recipient) ? recipient : "",
          "email": (email) ? email : "",
          "self_account_holder": (fullname) ? fullname : "",
          "else_account_holder": (account_name) ? account_name : "",
          "country": (country) ? country : "",
          "state": (state) ? state : "",
          "city": (city) ? city : "",
          "self_ifsc_code": (ifsc_code) ? ifsc_code : "",
          "else_ifsc_code": (else_ifsc_code) ? else_ifsc_code : "",
          "self_account_number": (account_number) ? account_number : "",
          "else_account_number": (else_account_number) ? else_account_number : "",
          "transfer_reason": data.transfer_reason,
        }

        const url = `${this.hosturl + this.port + "/three/send_money"}`;
        this.http.post(url, JSON.stringify(finalthree), { headers: this.headers }).toPromise()
          .then((res: Response) => {
            if (res.json().success) {
              localStorage.removeItem("recipient");
              this.router.navigate(['./send-money-four']);
            }
          })

      }

    } else if (trans_type == "zipco wallet") {

      let decryptedData_recipient = localStorage.getItem('recipient');

      if (decryptedData_recipient == null) {
        this.errrecipient = false;
        alertify.error("Please select any one recipient");
      } else {
        this.errrecipient = true;
      }

      if (this.rdobenificiary != "") {
        localStorage.removeItem("fullname");
        localStorage.removeItem("ifsc_code");
        localStorage.removeItem("account_number");

        localStorage.removeItem("email");
        localStorage.removeItem("account_name");
        localStorage.removeItem("country");
        localStorage.removeItem("state");
        localStorage.removeItem("city");
        localStorage.removeItem("else_ifsc_code");
        localStorage.removeItem("else_account_number");
      }

      if (this.errtransreason == true && this.errrecipient == true) {

        var bytesrecipient = CryptoJS.AES.decrypt(decryptedData_recipient.toString(), 'Zipcoin');
        var recipient = JSON.parse(bytesrecipient.toString(CryptoJS.enc.Utf8));

        let decryptedData_fullname = localStorage.getItem('fullname');
        if (decryptedData_fullname != null) {
          var bytesfullname = CryptoJS.AES.decrypt(decryptedData_fullname.toString(), 'Zipcoin');
          var fullname = JSON.parse(bytesfullname.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_ifsc_code = localStorage.getItem('ifsc_code');
        if (decryptedData_ifsc_code != null) {
          var bytesifsc_code = CryptoJS.AES.decrypt(decryptedData_ifsc_code.toString(), 'Zipcoin');
          var ifsc_code = JSON.parse(bytesifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_number = localStorage.getItem('account_number');
        if (decryptedData_account_number != null) {
          var bytesaccount_number = CryptoJS.AES.decrypt(decryptedData_account_number.toString(), 'Zipcoin');
          var account_number = JSON.parse(bytesaccount_number.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_email = localStorage.getItem('email');
        if (decryptedData_email != null) {
          var bytesemail = CryptoJS.AES.decrypt(decryptedData_email.toString(), 'Zipcoin');
          var email = JSON.parse(bytesemail.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_name = localStorage.getItem('account_name');
        if (decryptedData_account_name != null) {
          var bytesaccount_name = CryptoJS.AES.decrypt(decryptedData_account_name.toString(), 'Zipcoin');
          var account_name = JSON.parse(bytesaccount_name.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_country = localStorage.getItem('country');
        if (decryptedData_country != null) {
          var bytescountry = CryptoJS.AES.decrypt(decryptedData_country.toString(), 'Zipcoin');
          var country = JSON.parse(bytescountry.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_state = localStorage.getItem('state');
        if (decryptedData_state != null) {
          var bytesstate = CryptoJS.AES.decrypt(decryptedData_state.toString(), 'Zipcoin');
          var state = JSON.parse(bytesstate.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_city = localStorage.getItem('city');
        if (decryptedData_city != null) {
          var bytescity = CryptoJS.AES.decrypt(decryptedData_city.toString(), 'Zipcoin');
          var city = JSON.parse(bytescity.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_ifsc_code = localStorage.getItem('else_ifsc_code');
        if (decryptedData_else_ifsc_code != null) {
          var byteselse_ifsc_code = CryptoJS.AES.decrypt(decryptedData_else_ifsc_code.toString(), 'Zipcoin');
          var else_ifsc_code = JSON.parse(byteselse_ifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_account_number = localStorage.getItem('else_account_number');
        if (decryptedData_else_account_number != null) {
          var byteselse_account_number = CryptoJS.AES.decrypt(decryptedData_else_account_number.toString(), 'Zipcoin');
          var else_account_number = JSON.parse(byteselse_account_number.toString(CryptoJS.enc.Utf8));
        }

        var finalthree = {
          "sendid": this.upform,
          "benificiary_id": (this.rdobenificiary) ? this.rdobenificiary : "",
          "benificiary_type": (recipient) ? recipient : "",
          "email": (email) ? email : "",
          "self_account_holder": (fullname) ? fullname : "",
          "else_account_holder": (account_name) ? account_name : "",
          "country": (country) ? country : "",
          "state": (state) ? state : "",
          "city": (city) ? city : "",
          "self_ifsc_code": (ifsc_code) ? ifsc_code : "",
          "else_ifsc_code": (else_ifsc_code) ? else_ifsc_code : "",
          "self_account_number": (account_number) ? account_number : "",
          "else_account_number": (else_account_number) ? else_account_number : "",
          "transfer_reason": data.transfer_reason,
        }

        const url = `${this.hosturl + this.port + "/three/send_money"}`;
        this.http.post(url, JSON.stringify(finalthree), { headers: this.headers }).toPromise()
          .then((res: Response) => {
            if (res.json().success) {
              localStorage.removeItem("recipient");
              this.router.navigate(['./send-money-four']);
            }
          })

      }

    } else if (trans_type == "cash pickup") {

      let decryptedData_recipient = localStorage.getItem('recipient');

      if (decryptedData_recipient == null) {
        this.errrecipient = false;
        alertify.error("Please select any one recipient");
      } else {
        this.errrecipient = true;
      }

      if (this.rdobenificiary != "") {
        localStorage.removeItem("fullname");
        localStorage.removeItem("ifsc_code");
        localStorage.removeItem("account_number");

        localStorage.removeItem("email");
        localStorage.removeItem("account_name");
        localStorage.removeItem("country");
        localStorage.removeItem("state");
        localStorage.removeItem("city");
        localStorage.removeItem("else_ifsc_code");
        localStorage.removeItem("else_account_number");
      }

      if (this.errtransreason == true && this.errrecipient == true) {

        var bytesrecipient = CryptoJS.AES.decrypt(decryptedData_recipient.toString(), 'Zipcoin');
        var recipient = JSON.parse(bytesrecipient.toString(CryptoJS.enc.Utf8));

        let decryptedData_fullname = localStorage.getItem('fullname');
        if (decryptedData_fullname != null) {
          var bytesfullname = CryptoJS.AES.decrypt(decryptedData_fullname.toString(), 'Zipcoin');
          var fullname = JSON.parse(bytesfullname.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_ifsc_code = localStorage.getItem('ifsc_code');
        if (decryptedData_ifsc_code != null) {
          var bytesifsc_code = CryptoJS.AES.decrypt(decryptedData_ifsc_code.toString(), 'Zipcoin');
          var ifsc_code = JSON.parse(bytesifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_number = localStorage.getItem('account_number');
        if (decryptedData_account_number != null) {
          var bytesaccount_number = CryptoJS.AES.decrypt(decryptedData_account_number.toString(), 'Zipcoin');
          var account_number = JSON.parse(bytesaccount_number.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_email = localStorage.getItem('email');
        if (decryptedData_email != null) {
          var bytesemail = CryptoJS.AES.decrypt(decryptedData_email.toString(), 'Zipcoin');
          var email = JSON.parse(bytesemail.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_account_name = localStorage.getItem('account_name');
        if (decryptedData_account_name != null) {
          var bytesaccount_name = CryptoJS.AES.decrypt(decryptedData_account_name.toString(), 'Zipcoin');
          var account_name = JSON.parse(bytesaccount_name.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_country = localStorage.getItem('country');
        if (decryptedData_country != null) {
          var bytescountry = CryptoJS.AES.decrypt(decryptedData_country.toString(), 'Zipcoin');
          var country = JSON.parse(bytescountry.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_state = localStorage.getItem('state');
        if (decryptedData_state != null) {
          var bytesstate = CryptoJS.AES.decrypt(decryptedData_state.toString(), 'Zipcoin');
          var state = JSON.parse(bytesstate.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_city = localStorage.getItem('city');
        if (decryptedData_city != null) {
          var bytescity = CryptoJS.AES.decrypt(decryptedData_city.toString(), 'Zipcoin');
          var city = JSON.parse(bytescity.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_ifsc_code = localStorage.getItem('else_ifsc_code');
        if (decryptedData_else_ifsc_code != null) {
          var byteselse_ifsc_code = CryptoJS.AES.decrypt(decryptedData_else_ifsc_code.toString(), 'Zipcoin');
          var else_ifsc_code = JSON.parse(byteselse_ifsc_code.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_else_account_number = localStorage.getItem('else_account_number');
        if (decryptedData_else_account_number != null) {
          var byteselse_account_number = CryptoJS.AES.decrypt(decryptedData_else_account_number.toString(), 'Zipcoin');
          var else_account_number = JSON.parse(byteselse_account_number.toString(CryptoJS.enc.Utf8));
        }

        var finalthree = {
          "sendid": this.upform,
          "benificiary_id": (this.rdobenificiary) ? this.rdobenificiary : "",
          "benificiary_type": (recipient) ? recipient : "",
          "email": (email) ? email : "",
          "self_account_holder": (fullname) ? fullname : "",
          "else_account_holder": (account_name) ? account_name : "",
          "country": (country) ? country : "",
          "state": (state) ? state : "",
          "city": (city) ? city : "",
          "self_ifsc_code": (ifsc_code) ? ifsc_code : "",
          "else_ifsc_code": (else_ifsc_code) ? else_ifsc_code : "",
          "self_account_number": (account_number) ? account_number : "",
          "else_account_number": (else_account_number) ? else_account_number : "",
          "transfer_reason": data.transfer_reason,
        }

        const url = `${this.hosturl + this.port + "/three/send_money"}`;
        this.http.post(url, JSON.stringify(finalthree), { headers: this.headers }).toPromise()
          .then((res: Response) => {
            if (res.json().success) {
              localStorage.removeItem("recipient");
              this.router.navigate(['./send-money-four']);
            }
          })

      }

    }

  }

  close_self = function () {
    this.selfcss = false;
  }

  close_else = function () {
    this.elsecss = false;
  }

  open = function () {
    this.beni = true;
  }

  close = function () {
    this.beni = false;
  }

  benificiary = function (data) {

    let valid_holder = /^[a-zA-Z ]*$/;
    let chkacholder = valid_holder.test(data.account_holder);
    let chkza_bankname = valid_holder.test(data.za_bankname);

    let valid_digit_phone = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit_phone.test(data.phone);

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chkemail = valid_email.test(data.comemail);

    let valid_digitrouting = /^[a-zA-Z0-9 ]*$/;
    let chkus_routing = valid_digitrouting.test(data.routingno);

    let valid_digit = /^[0-9 ]*$/;
    let chkus_accountno = valid_digit.test(data.us_accountno);
    let chkinstitutionno = valid_digit.test(data.institutionno);
    let chktransitno = valid_digit.test(data.transitno);
    let chkca_accountno = valid_digit.test(data.ca_accountno);
    let chkgb_ukcode = valid_digit.test(data.ukcode);
    let chkgb_accountno = valid_digit.test(data.gb_accountno);
    let chkza_accountno = valid_digit.test(data.za_accountno);
    let chkza_phoneno = valid_digit.test(data.za_phoneno);

    if (data.currency == "") {
      this.errcurrency = false;
      alertify.error("Please Select Currency");
    } else {
      this.errcurrency = true;
    }

    if (data.recipientType == "") {
      this.errrectype = false;
      alertify.error("Please Select Beneficiary Type");
    } else {
      this.errrectype = true;
    }

    if (data.account_holder == "" || chkacholder == false) {
      this.errholder = false;
      alertify.error("Please Enter Full Name Of The Account Holder");
    } else {
      this.errholder = true;
    }

    if (data.phone == "" || chkphone == false) {
      this.errphone = false;
      alertify.error("Please Enter Valid Phone Number");
    } else {
      this.errphone = true;
    }

    if (data.comemail == "" || chkemail == false) {
      this.errcomemail = false;
      alertify.error("Please Enter Valid Email");
    } else {
      this.errcomemail = true;
    }

    if (data.currency == 16) {

      if (this.chkverify == true) {

        if (data.institutionno == "" || chkinstitutionno == false) {
          this.errinstino = false;
          alertify.error("Please Enter Institution No");
        } else {
          if (data.institutionno.length == 3) {
            this.errinstino = true;
          } else {
            this.errinstino = false;
            alertify.error("Value length must be no more than 3 characters in Institution No");
          }
        }

        if (data.transitno == "" || chktransitno == false) {
          this.errtransitno = false;
          alertify.error("Please Enter Transit No");
        } else {
          if (data.transitno.length == 5) {
            this.errtransitno = true;
          } else {
            this.errtransitno = false;
            alertify.error("Value length must be no more than 5 characters in Transit No");
          }
        }

        if (data.ca_accountno == "" || chkca_accountno == false) {
          this.errca_accountno = false;
          alertify.error("Please Enter Account Number");
        } else {
          if (data.ca_accountno.length >= 7) {
            this.errca_accountno = true;
          } else {
            this.errca_accountno = false;
            alertify.error("Value length must be at least 7 characters in Account No");
          }
        }

        if (data.ca_accounttype == "") {
          this.errca_accounttype = false;
          alertify.error("Please Select Account Type");
        } else {
          this.errca_accounttype = true;
        }

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true && this.errinstino == true && this.errtransitno == true && this.errca_accountno == true &&
          this.errca_accounttype == true) {

          let usdata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "institutionno": data.institutionno,
            "transitno": data.transitno,
            "ca_accountno": data.ca_accountno,
            "ca_accounttype": data.ca_accounttype
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      } else {

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {

          let usdata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "institutionno": "",
            "transitno": "",
            "ca_accountno": "",
            "ca_accounttype": ""
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      }

    } else if (data.currency == 17) {

      if (this.chkverify == true) {

        if (data.routingno == "" || chkus_routing == false) {
          alertify.error("Please Enter Routing Number");
          this.errroutingno = false;
        } else {
          this.errroutingno = true;
        }

        if (data.us_accountno == "" || chkus_accountno == false) {
          this.errus_accountno = false;
          alertify.error("Please Enter Account Number");
        } else {
          this.errus_accountno = true;
        }

        if (data.us_accounttype == "") {
          this.errus_accounttype = false;
          alertify.error("Please Select Account Type");
        } else {
          this.errus_accounttype = true;
        }

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true && this.errroutingno == true && this.errus_accountno == true
          && this.errus_accounttype == true) {

          let usdata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "bank_account_country": "",
            "routingno": data.routingno,
            "us_accountno": data.us_accountno,
            "us_accounttype": data.us_accounttype
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })


        }

      } else {
        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {

          let usdata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "bank_account_country": "",
            "routingno": "",
            "us_accountno": "",
            "us_accounttype": ""
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })

        }
      }

    } else if (data.currency == 23) {

      if (this.chkverify == true) {

        if (data.ukcode == "" || chkgb_ukcode == false) {
          this.erruksortcode = false;
          alertify.error("Please Enter UK Code");
        } else {
          if (data.ukcode.length >= 6) {
            this.erruksortcode = true;
          } else {
            this.erruksortcode = false;
            alertify.error("Value length must be at least 6 characters in UK code");
          }
        }

        if (data.gb_accountno == "" || chkgb_accountno == false) {
          this.errgb_accountno = false;
          alertify.error("Please Enter Account Number");
        } else {
          if (data.gb_accountno.length <= 9) {
            this.errgb_accountno = true;
          } else {
            this.errgb_accountno = false;
            alertify.error("Value length must be no more than 9 characters in Account number");
          }
        }

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true && this.erruksortcode == true && this.errgb_accountno == true) {

          let audata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "gb_ukcode": data.ukcode,
            "gb_accountno": data.gb_accountno
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(audata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      } else {
        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {

          let audata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "gb_ukcode": "",
            "gb_accountno": ""
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(audata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })

        }
      }



    } else if (data.currency == 27) {

      if (this.chkverify == true) {

        if (data.za_bankname == "" || chkza_bankname == false) {
          this.errza_bankname = false;
          alertify.error("Please Enter Beneficiary's Bank Name");
        } else {
          this.errza_bankname = true;
        }

        if (data.za_accountno == "" || chkza_accountno == false) {
          this.errza_accountno = false;
          alertify.error("Please Enter Account Number");
        } else {
          if (data.za_accountno.length >= 10) {
            this.errza_accountno = true;
          } else {
            this.errza_accountno = false;
            alertify.error("Invalid Format in Account number");
          }
        }

        if (data.za_phoneno == "" || chkza_phoneno == false) {
          this.errza_phoneno = false;
          alertify.error("Please Enter Phone Number");
        } else {
          if (data.za_phoneno.length >= 10) {
            this.errza_phoneno = true;
          } else {
            this.errza_phoneno = false;
            alertify.error("Invalid Format in Phone number");
          }
        }

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true && this.errza_bankname == true && this.errza_accountno == true && this.errza_phoneno == true) {

          let zadata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "za_bankname": data.za_bankname,
            "za_accountno": data.za_accountno,
            "za_phoneno": data.za_phoneno
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(zadata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      } else {

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {

          let zadata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "za_bankname": "",
            "za_accountno": "",
            "za_phoneno": ""
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(zadata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      }

    } else if (data.currency == 28) {

      if (this.chkverify == true) {

        if (data.er_iban == "") {
          this.errer_iban = false;
          alertify.error("Please Enter IBAN Number");
        } else {
          this.errer_iban = true;
        }

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true && this.errer_iban == true) {

          let erdata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "er_iban": data.er_iban
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(erdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      } else {

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {

          let erdata = {
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "er_iban": ""
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(erdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                this.allbenificiarydata();
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      }

    }

  }

  changeval = function (val) {
    if (val == 'personal') {
      this.text = "Full Name Of The Account Holder";
    } else {
      this.text = "Name Of The Business / Charity";
    }
  }

  change = function (id) {

    if (id != "") {
      const cust_benificiary = `${this.hosturl + this.port + "/benificiary_flage/"}${id}`;
      this.http.get(cust_benificiary).subscribe(
        (res: Response) => {
          let bflage = res.json().benificiary_flage;
          this.disflage = bflage[0].flage_iso;
          this.phone_code = bflage[0].country_code;

          if (id == 16) {

            this.chkverify = true;
            this.ca = true;
            this.us = false;
            this.gb = false;
            this.za = false;
            this.er = false;

          } else if (id == 17) {

            this.chkverify = true;
            this.ca = false;
            this.us = true;
            this.gb = false;
            this.za = false;
            this.er = false;

          } else if (id == 23) {

            this.chkverify = true;
            this.ca = false;
            this.us = false;
            this.gb = true;
            this.za = false;
            this.er = false;

          } else if (id == 27) {

            this.chkverify = true;
            this.ca = false;
            this.us = false;
            this.gb = false;
            this.za = true;
            this.er = false;

          } else if (id == 28) {

            this.chkverify = true;
            this.ca = false;
            this.us = false;
            this.gb = false;
            this.za = false;
            this.er = true;

          }

        });
    } else {

      this.disflage = "";
      this.us = false;
      this.ca = false;
      this.gb = false;
      this.za = false;
      this.er = false;
      this.chkverify = false;

    }

  }

  allbenificiarydata = function () {
    const recipientdata = `${this.hosturl + this.port + "/getrecipient_data/"}${this.custid}`;
    this.http.get(recipientdata).subscribe(
      (res: Response) => {
        this.recipientdata = res.json().benificiary;

        if (this.recipientdata == "") {
          this.showres = false;
        } else {
          this.showres = true;
        }

      });

  }

  checkvalid_holdername = function (data) {

    let valid_name = /^[a-zA-Z ]*$/;
    let chkholder = valid_name.test(data);

    if (chkholder == false) {
      this.errholder = false;
      alertify.error("Please Enter Valid Full name of the account holder");
    } else {
      this.errholder = true;
    }

  }

  checkvalid_routingno = function (data) {

    let valid_digitrouting = /^[a-zA-Z0-9 ]*$/;
    let chkus_routing = valid_digitrouting.test(data);

    if (chkus_routing == false) {
      alertify.error("Please Enter Routing Number");
      this.errroutingno = false;
    } else {
      this.errroutingno = true;
    }

  }

  checkvalid_accountno = function (data) {

    let valid_digit = /^[0-9 ]*$/;
    let chkaccount = valid_digit.test(data);

    if (chkaccount == false) {
      this.errus_accountno = false;
      alertify.error("Please Enter Account Number");
    } else {
      this.errus_accountno = true;
    }

  }

  checkvalid_institution = function (data) {

    let valid_digit = /^[0-9 ]*$/;
    let chkinstituionno = valid_digit.test(data);

    if (chkinstituionno == false) {
      this.errinstino = false;
      alertify.error("Please Enter Institution No");
    } else {
      if (data.length == 3) {
        this.errinstino = true;
      } else {
        this.errinstino = false;
        alertify.error("Value length must be no more than 3 characters in Institution No");
      }
    }

  }

  // checkvalid_transiton = function (data) {

  //   let valid_digit = /^[0-9 ]*$/;
  //   let chktransitno = valid_digit.test(data);

  //   if (chktransitno == false) {
  //     this.errtransitno = false;
  //     alertify.error("Please Enter Transit No");
  //   } else {
  //     if (data.length == 5) {
  //       this.errtransitno = true;
  //     } else {
  //       this.errtransitno = false;
  //       alertify.error("Value length must be no more than 5 characters in Transit No");
  //     }
  //   }

  // }

  checkvalid_ukcode = function (data) {

    let valid_digit = /^[0-9 ]*$/;
    let chktransitno = valid_digit.test(data);

    if (chktransitno == false) {
      this.erruksortcode = false;
      alertify.error("Please Enter UK Code");
    } else {
      if (data.length >= 6) {
        this.erruksortcode = true;
      } else {
        this.erruksortcode = false;
        alertify.error("Value length must be at least 6 characters in UK code");
      }
    }

  }

  checkvalid_ukaccountno = function (data) {

    let valid_digit = /^[0-9 ]*$/;
    let chkaccount = valid_digit.test(data);

    if (chkaccount == false) {
      this.errgb_accountno = false;
      alertify.error("Please Enter Account Number");
    } else {
      if (data.length <= 9) {
        this.errgb_accountno = true;
      } else {
        this.errgb_accountno = false;
        alertify.error("Value length must be no more than 9 characters in Account number");
      }
    }

  }

  checkvalid_bankname = function (data) {

    let valid_name = /^[a-zA-Z ]*$/;
    let chkholder = valid_name.test(data);

    if (chkholder == false) {
      this.errza_bankname = false;
      alertify.error("Please Enter Beneficiary's Bank Name");
    } else {
      this.errza_bankname = true;
    }

  }

  checkvalid_zaacountno = function (data) {

    let valid_digit = /^[0-9 ]*$/;
    let chkaccount = valid_digit.test(data);

    if (chkaccount == false) {
      this.errza_accountno = false;
      alertify.error("Please Enter Account Number");
    } else {
      if (data.length >= 10) {
        this.errza_accountno = true;
      } else {
        this.errza_accountno = false;
        alertify.error("Invalid Format in Account number");
      }
    }

  }

  checkvalid_zaphoneno = function (data) {

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(data);

    if (chkphone == false) {
      this.errza_phoneno = false;
      alertify.error("Please Enter Phone Number");
    } else {
      if (data.length >= 10) {
        this.errza_phoneno = true;
      } else {
        this.errza_phoneno = false;
        alertify.error("Invalid Format in Phone number");
      }
    }

  }

  toggleVisibility = function (e) {

    if (e.target.checked == true) {

      if (this.currency == 16) {

        this.ca = true;
        this.us = false;
        this.gb = false;
        this.za = false;
        this.er = false;

      } else if (this.currency == 17) {

        this.ca = false;
        this.us = true;
        this.gb = false;
        this.za = false;
        this.er = false;

      } else if (this.currency == 23) {

        this.ca = false;
        this.us = false;
        this.gb = true;
        this.za = false;
        this.er = false;

      } else if (this.currency == 27) {

        this.ca = false;
        this.us = false;
        this.gb = false;
        this.za = true;
        this.er = false;

      } else if (this.currency == 28) {

        this.ca = false;
        this.us = false;
        this.gb = false;
        this.za = false;
        this.er = true;

      }

    } else {

      this.us = false;
      this.ca = false;
      this.gb = false;
      this.za = false;
      this.er = false;

    }
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

        this.errfullname = true;
        this.errifsc_code = true;
        this.erraccount_number = true;

        this.fullname = "";
        this.ifsc_code = "";
        this.account_number = "";

        this.country = "";
        this.city = "";
        this.state = "";
        this.email = "";
        this.account_name = "";
        this.else_ifsc_code = "";
        this.else_account_number = "";

        this.erremail = true;
        this.erraccount_name = true;
        this.errcountry = true;
        this.errstate = true;
        this.errcity = true;
        this.errelse_ifsc_code = true;
        this.errelse_account_number = true;
        this.errtransreason = true;
        this.errrecipient = true;

        this.reccountry = "";
        this.reccity = "";
        this.recstate = "";
        this.recname = "";
        this.recaddress = "";
        this.recphone = "";
        this.recemail = "";

        this.errrecname = true;
        this.errrecaddress = true;
        this.errreccountry = true;
        this.errrecstate = true;
        this.errreccity = true;
        this.errrecphone = true;
        this.errrecemail = true;

        this.rdobenificiary = "";
        this.transfer_reason = "";

        this.beni = false;

        this.close_self();
        this.close_else();

        this.currency = "";
        this.disflage = "";
        this.text = "Full Name Of The Account Holder";

        this.errrectype = true;
        this.errholder = true;
        this.errcurrency = true;


        this.errbankcountry = true;
        this.errroutingno = true;
        this.errus_accountno = true;
        this.errus_accounttype = true;
        this.errinstino = true;
        this.errtransitno = true;
        this.errca_accountno = true;
        this.errca_accounttype = true;
        this.errgb_accountno = true;
        this.erruksortcode = true;
        this.errza_bankname = true;
        this.errza_accountno = true;
        this.errza_phoneno = true;
        this.errer_iban = true;


        this.currency = "";

        this.bankcountry = "";

        this.errphone = true;
        this.phone = "";
        this.phone_code = "";

        this.comemail = "";
        this.errcomemail = true;

        const getbcountry = `${this.hosturl + this.port + "/get_bcountry"}`;
        this.http.get(getbcountry).subscribe(
          (res: Response) => {
            this.benifcountry = res.json().get_bcountry;
          }
        )

        this.allbenificiarydata();

        const countrydata = `${this.hosturl + this.port + "/country"}`;
        this.http.get(countrydata).subscribe(
          (res: Response) => {
            this.countryname = res.json().country;
          });

        const agentdata = `${this.hosturl + this.port + "/get_all_agent"}`;
        this.http.get(agentdata).subscribe(
          (res: Response) => {
            this.agentdetails = res.json().allagent_details;

            if (this.agentdetails == "") {
              this.showagent = false;
            } else {
              this.showagent = true;
            }

          });




        let decryptedData_upform = localStorage.getItem('sendid');
        var bytes_upform = CryptoJS.AES.decrypt(decryptedData_upform.toString(), 'Zipcoin');
        this.upform = JSON.parse(bytes_upform.toString(CryptoJS.enc.Utf8));

        const gettrasferdata = `${this.hosturl + this.port + "/getsend_money_data/"}${this.upform}`;
        this.http.get(gettrasferdata).subscribe(
          (res: Response) => {
            this.transdata = res.json().transfer;

            if (this.transdata[0].benificiary_type == "") {

              this.rdobenificiary = "";

              this.fullname = "";
              this.ifsc_code = "";
              this.account_number = "";

              this.email = "";
              this.account_name = "";
              this.country = "";
              this.state = "";
              this.city = "";
              this.else_ifsc_code = "";
              this.else_account_number = "";

              this.transfer_reason = "";

              let decryptedData_type = localStorage.getItem('transfer_type');
              var bytes_type = CryptoJS.AES.decrypt(decryptedData_type.toString(), 'Zipcoin');
              let trans_type = JSON.parse(bytes_type.toString(CryptoJS.enc.Utf8));


              if (trans_type == "bank transfer") {

                this.bank_transfer = true;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = false;

              } else if (trans_type == "cash pick-up") {

                this.bank_transfer = false;
                this.cash_pick_up = true;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = false;

              } else if (trans_type == "mobile top-up") {

                this.bank_transfer = false;
                this.cash_pick_up = false;
                this.mobile_top_up = true;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = false;

              } else if (trans_type == "airtime top-up") {

                this.bank_transfer = false;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = true;
                this.gift_card = false;
                this.zipco_wallet = false;

              } else if (trans_type == "gift card") {

                this.bank_transfer = false;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = true;
                this.zipco_wallet = false;

              } else if (trans_type == "zipco wallet") {

                this.bank_transfer = false;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = true;

              } else if (trans_type == "cash pickup") {

                this.bank_transfer = true;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = false;

              }

            } else {

              let type = this.transdata[0].transfer_type;

              this.rdobenificiary = this.transdata[0].benificiary_id;

              this.fullname = this.transdata[0].self_account_holder;
              this.ifsc_code = this.transdata[0].self_ifsc_code;
              this.account_number = this.transdata[0].self_account_number;

              this.email = this.transdata[0].email;
              this.account_name = this.transdata[0].else_account_holder;

              this.country = this.transdata[0].country;
              this.countrystate(this.country);

              this.state = this.transdata[0].state;
              this.statecity(this.state);

              this.city = this.transdata[0].city;
              this.else_ifsc_code = this.transdata[0].else_ifsc_code;
              this.else_account_number = this.transdata[0].else_account_number;

              this.transfer_reason = this.transdata[0].transfer_reason;

              var type_recipient = CryptoJS.AES.encrypt(JSON.stringify(this.transdata[0].benificiary_type), 'Zipcoin');
              localStorage.setItem("recipient", type_recipient.toString());

              if (type == "bank transfer") {

                this.bank_transfer = true;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = false;

                this.rdobenificiary = this.transdata[0].benificiary_id;

                this.fullname = this.transdata[0].self_account_holder;
                this.ifsc_code = this.transdata[0].self_ifsc_code;
                this.account_number = this.transdata[0].self_account_number;

                this.email = this.transdata[0].email;
                this.account_name = this.transdata[0].else_account_holder;

                this.country = this.transdata[0].country;
                this.countrystate(this.country);

                this.state = this.transdata[0].state;
                this.statecity(this.state);

                this.city = this.transdata[0].city;
                this.else_ifsc_code = this.transdata[0].else_ifsc_code;
                this.else_account_number = this.transdata[0].else_account_number;

                this.transfer_reason = this.transdata[0].transfer_reason;

                var type_recipient = CryptoJS.AES.encrypt(JSON.stringify(this.transdata[0].benificiary_type), 'Zipcoin');
                localStorage.setItem("recipient", type_recipient.toString());


              } else if (type == "cash pick-up") {

                this.bank_transfer = false;
                this.cash_pick_up = true;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = false;

                this.rdoagent = this.transdata[0].agentid;
                this.recname = this.transdata[0].recname;
                this.recaddress = this.transdata[0].recaddress;

                this.reccountry = this.transdata[0].reccountry;
                this.countrystate(this.reccountry);

                this.recstate = this.transdata[0].recstate;
                this.statecity(this.recstate);

                this.reccity = this.transdata[0].reccity;
                this.recphone = this.transdata[0].recphone;
                this.recemail = this.transdata[0].recemail;

                this.transfer_reason = this.transdata[0].transfer_reason;

                var type_recipient = CryptoJS.AES.encrypt(JSON.stringify(this.transdata[0].benificiary_type), 'Zipcoin');
                localStorage.setItem("recipient", type_recipient.toString());

              } else if (type == "mobile top-up") {

                this.bank_transfer = false;
                this.cash_pick_up = false;
                this.mobile_top_up = true;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = false;

                this.rdobenificiary = this.transdata[0].benificiary_id;

                this.fullname = this.transdata[0].self_account_holder;
                this.ifsc_code = this.transdata[0].self_ifsc_code;
                this.account_number = this.transdata[0].self_account_number;

                this.email = this.transdata[0].email;
                this.account_name = this.transdata[0].else_account_holder;

                this.country = this.transdata[0].country;
                this.countrystate(this.country);

                this.state = this.transdata[0].state;
                this.statecity(this.state);

                this.city = this.transdata[0].city;
                this.else_ifsc_code = this.transdata[0].else_ifsc_code;
                this.else_account_number = this.transdata[0].else_account_number;

                this.transfer_reason = this.transdata[0].transfer_reason;

                var type_recipient = CryptoJS.AES.encrypt(JSON.stringify(this.transdata[0].benificiary_type), 'Zipcoin');
                localStorage.setItem("recipient", type_recipient.toString());

              } else if (type == "airtime top-up") {

                this.bank_transfer = false;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = true;
                this.gift_card = false;
                this.zipco_wallet = false;

                this.rdobenificiary = this.transdata[0].benificiary_id;

                this.fullname = this.transdata[0].self_account_holder;
                this.ifsc_code = this.transdata[0].self_ifsc_code;
                this.account_number = this.transdata[0].self_account_number;

                this.email = this.transdata[0].email;
                this.account_name = this.transdata[0].else_account_holder;

                this.country = this.transdata[0].country;
                this.countrystate(this.country);

                this.state = this.transdata[0].state;
                this.statecity(this.state);

                this.city = this.transdata[0].city;
                this.else_ifsc_code = this.transdata[0].else_ifsc_code;
                this.else_account_number = this.transdata[0].else_account_number;

                this.transfer_reason = this.transdata[0].transfer_reason;

                var type_recipient = CryptoJS.AES.encrypt(JSON.stringify(this.transdata[0].benificiary_type), 'Zipcoin');
                localStorage.setItem("recipient", type_recipient.toString());

              } else if (type == "gift card") {

                this.bank_transfer = false;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = true;
                this.zipco_wallet = false;

                this.rdobenificiary = this.transdata[0].benificiary_id;

                this.fullname = this.transdata[0].self_account_holder;
                this.ifsc_code = this.transdata[0].self_ifsc_code;
                this.account_number = this.transdata[0].self_account_number;

                this.email = this.transdata[0].email;
                this.account_name = this.transdata[0].else_account_holder;

                this.country = this.transdata[0].country;
                this.countrystate(this.country);

                this.state = this.transdata[0].state;
                this.statecity(this.state);

                this.city = this.transdata[0].city;
                this.else_ifsc_code = this.transdata[0].else_ifsc_code;
                this.else_account_number = this.transdata[0].else_account_number;

                this.transfer_reason = this.transdata[0].transfer_reason;

                var type_recipient = CryptoJS.AES.encrypt(JSON.stringify(this.transdata[0].benificiary_type), 'Zipcoin');
                localStorage.setItem("recipient", type_recipient.toString());

              } else if (type == "zipco wallet") {

                this.bank_transfer = false;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = true;

                this.rdobenificiary = this.transdata[0].benificiary_id;

                this.fullname = this.transdata[0].self_account_holder;
                this.ifsc_code = this.transdata[0].self_ifsc_code;
                this.account_number = this.transdata[0].self_account_number;

                this.email = this.transdata[0].email;
                this.account_name = this.transdata[0].else_account_holder;

                this.country = this.transdata[0].country;
                this.countrystate(this.country);

                this.state = this.transdata[0].state;
                this.statecity(this.state);

                this.city = this.transdata[0].city;
                this.else_ifsc_code = this.transdata[0].else_ifsc_code;
                this.else_account_number = this.transdata[0].else_account_number;

                this.transfer_reason = this.transdata[0].transfer_reason;

                var type_recipient = CryptoJS.AES.encrypt(JSON.stringify(this.transdata[0].benificiary_type), 'Zipcoin');
                localStorage.setItem("recipient", type_recipient.toString());

              } else if (type == "cash pickup") {

                this.bank_transfer = true;
                this.cash_pick_up = false;
                this.mobile_top_up = false;
                this.airtime_top_up = false;
                this.gift_card = false;
                this.zipco_wallet = false;

                this.rdobenificiary = this.transdata[0].benificiary_id;

                this.fullname = this.transdata[0].self_account_holder;
                this.ifsc_code = this.transdata[0].self_ifsc_code;
                this.account_number = this.transdata[0].self_account_number;

                this.email = this.transdata[0].email;
                this.account_name = this.transdata[0].else_account_holder;

                this.country = this.transdata[0].country;
                this.countrystate(this.country);

                this.state = this.transdata[0].state;
                this.statecity(this.state);

                this.city = this.transdata[0].city;
                this.else_ifsc_code = this.transdata[0].else_ifsc_code;
                this.else_account_number = this.transdata[0].else_account_number;

                this.transfer_reason = this.transdata[0].transfer_reason;

                var type_recipient = CryptoJS.AES.encrypt(JSON.stringify(this.transdata[0].benificiary_type), 'Zipcoin');
                localStorage.setItem("recipient", type_recipient.toString());


              }

            }
          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }


  }

}
