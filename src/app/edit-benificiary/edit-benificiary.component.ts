import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-edit-benificiary',
  templateUrl: './edit-benificiary.component.html',
  styleUrls: ['./edit-benificiary.component.css']
})
export class EditBenificiaryComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  country: any;
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


  routingno: any;
  us_accountno: any;
  us_accounttype: any;

  institutionno: any;
  transitno: any;
  ca_accountno: any;
  ca_accounttype: any;

  recipientType: any;
  account_holder: any;

  gb_accountno: any;
  ukcode: any;

  za_bankname: any;
  za_accountno: any;
  za_phoneno: any;

  er_iban: any;

  text: any;
  us: any;
  ca: any;
  gb: any;
  za: any;
  er: any;

  bankcountry: any;
  custid: any;
  bid: any;
  disflage: any;

  phone: any;
  errphone: any;
  phonecode: any;

  address: any;
  erraddress: any;
  errcomemail: boolean;
  comemail: any;

  chkverify: any;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  edit_benificiary = function (data) {

    let valid_holder = /^[a-zA-Z ]*$/;
    let chkacholder = valid_holder.test(data.account_holder);
    let chkza_bankname = valid_holder.test(data.za_bankname);

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chkemail = valid_email.test(data.comemail);

    let valid_digit_phone = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit_phone.test(data.phone);

    let valid_digit = /^[0-9 ]*$/;
    let chkus_accountno = valid_digit.test(data.us_accountno);
    let chkinstitutionno = valid_digit.test(data.institutionno);
    let chktransitno = valid_digit.test(data.transitno);
    let chkgb_ukcode = valid_digit.test(data.ukcode);
    let chkca_accountno = valid_digit.test(data.ca_accountno);
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

          let cadata = {
            "bid": this.bid,
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

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(cadata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
              } else {
                alertify.error(res.json().msg);
              }
            })
        }

      } else {

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {

          let cadata = {
            "bid": this.bid,
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

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(cadata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      }

    } else if (data.currency == 17) {

      if (this.chkverify == true) {

        if (data.routingno == "") {
          this.errroutingno = false;
          alertify.error("Please Enter Routing Number");
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
            "bid": this.bid,
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

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
              } else {
                alertify.error(res.json().msg);
              }
            })


        }

      } else {

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {


          let usdata = {
            "bid": this.bid,
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

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
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
            alertify.error("Value length must be at least 6 characters in BSB code");
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
            "bid": this.bid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "gb_ukcode": data.ukcode,
            "gb_accountno": data.gb_accountno
          }

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(audata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      } else {

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {

          let audata = {
            "bid": this.bid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "gb_ukcode": "",
            "gb_accountno": ""
          }

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(audata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
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
            alertify.error("Invalid Format in Account number");
          }
        }

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true && this.errza_bankname == true && this.errza_accountno == true && this.errza_phoneno == true) {

          let zadata = {
            "bid": this.bid,
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

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(zadata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      } else {

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {

          let zadata = {
            "bid": this.bid,
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

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(zadata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
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
            "bid": this.bid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "er_iban": data.er_iban
          }

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(erdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
              } else {
                alertify.error(res.json().msg);
              }
            })

        }

      } else {

        if (this.errcurrency == true && this.errrectype == true && this.errholder == true &&
          this.errphone == true && this.errcomemail == true) {

          let erdata = {
            "bid": this.bid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "er_iban": ""
          }

          const url = `${this.hosturl + this.port + "/upbenificiary"}`;
          this.http.put(url, JSON.stringify(erdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
                localStorage.removeItem('bid');
                this.router.navigate(['/benificiary']);
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
      this.text = "Full name of the account holder";
    } else {
      this.text = "Name of the business / charity";
    }
  }

  change = function (id) {

    if (id != "") {
      const cust_benificiary = `${this.hosturl + this.port + "/benificiary_flage/"}${id}`;
      this.http.get(cust_benificiary).subscribe(
        (res: Response) => {
          let bflage = res.json().benificiary_flage;
          this.disflage = bflage[0].flage_iso;
          this.phonecode = bflage[0].country_code;

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

        let decryptedData_bid = localStorage.getItem('bid');
        var bytes_bid = CryptoJS.AES.decrypt(decryptedData_bid.toString(), 'Zipcoin');
        this.bid = JSON.parse(bytes_bid.toString(CryptoJS.enc.Utf8));

        const cust_benificiary = `${this.hosturl + this.port + "/cust_benificiary/"}${this.bid}`;
        this.http.get(cust_benificiary).subscribe(
          (res: Response) => {
            let benificiary_details = res.json().cust_benificiary;

            if (benificiary_details[0].currency == "16") {

              this.currency = benificiary_details[0].currency;
              this.disflage = benificiary_details[0].flage_iso;
              this.phonecode = benificiary_details[0].country_code;

              this.recipientType = benificiary_details[0].recipient_type;

              if (this.recipientType == 'personal') {
                this.text = "Full name of the account holder";
              } else {
                this.text = "Name of the business / charity";
              }

              this.account_holder = benificiary_details[0].name_business;
              this.phone = benificiary_details[0].phoneno;
              this.comemail = benificiary_details[0].email;

              let cverify = benificiary_details[0].chkverify;
              if (cverify == 0) {

                this.chkverify = false;

                this.ca = false;
                this.us = false;
                this.gb = false;
                this.za = false;
                this.er = false;

              } else {

                this.chkverify = true;

                this.ca = true;
                this.us = false;
                this.gb = false;
                this.za = false;
                this.er = false;

                this.institutionno = benificiary_details[0].CA_institution_no;
                this.transitno = benificiary_details[0].CA_transit_no;
                this.ca_accountno = benificiary_details[0].CA_account_no;
                this.ca_accounttype = benificiary_details[0].CA_account_type;

              }

            } else if (benificiary_details[0].currency == "17") {

              this.currency = benificiary_details[0].currency;
              this.disflage = benificiary_details[0].flage_iso;
              this.phonecode = benificiary_details[0].country_code;

              this.recipientType = benificiary_details[0].recipient_type;

              if (this.recipientType == 'personal') {
                this.text = "Full name of the account holder";
              } else {
                this.text = "Name of the business / charity";
              }

              this.account_holder = benificiary_details[0].name_business;
              this.phone = benificiary_details[0].phoneno;
              this.comemail = benificiary_details[0].email;


              let cverify = benificiary_details[0].chkverify;
              if (cverify == 0) {

                this.chkverify = false;

                this.ca = false;
                this.us = false;
                this.gb = false;
                this.za = false;
                this.er = false;

              } else {

                this.chkverify = true;

                this.ca = false;
                this.us = true;
                this.gb = false;
                this.za = false;
                this.er = false;
                this.routingno = benificiary_details[0].US_routing_no;
                this.us_accountno = benificiary_details[0].US_account_no;
                this.us_accounttype = benificiary_details[0].US_account_type;
              }

            } else if (benificiary_details[0].currency == "23") {

              this.currency = benificiary_details[0].currency;
              this.disflage = benificiary_details[0].flage_iso;
              this.phonecode = benificiary_details[0].country_code;

              this.recipientType = benificiary_details[0].recipient_type;

              if (this.recipientType == 'personal') {
                this.text = "Full name of the account holder";
              } else {
                this.text = "Name of the business / charity";
              }

              this.account_holder = benificiary_details[0].name_business;
              this.phone = benificiary_details[0].phoneno;
              this.comemail = benificiary_details[0].email;

              let cverify = benificiary_details[0].chkverify;
              if (cverify == 0) {

                this.chkverify = false;

                this.ca = false;
                this.us = false;
                this.gb = false;
                this.za = false;
                this.er = false;

              } else {

                this.chkverify = true;

                this.ca = false;
                this.us = false;
                this.gb = true;
                this.za = false;
                this.er = false;
                this.ukcode = benificiary_details[0].GB_ukcode;
                this.gb_accountno = benificiary_details[0].GB_account_no;
              }

            } else if (benificiary_details[0].currency == "27") {

              this.currency = benificiary_details[0].currency;
              this.disflage = benificiary_details[0].flage_iso;
              this.phonecode = benificiary_details[0].country_code;

              this.recipientType = benificiary_details[0].recipient_type;

              if (this.recipientType == 'personal') {
                this.text = "Full name of the account holder";
              } else {
                this.text = "Name of the business / charity";
              }

              this.account_holder = benificiary_details[0].name_business;
              this.phone = benificiary_details[0].phoneno;
              this.comemail = benificiary_details[0].email;

              let cverify = benificiary_details[0].chkverify;
              if (cverify == 0) {

                this.chkverify = false;

                this.ca = false;
                this.us = false;
                this.gb = false;
                this.za = false;
                this.er = false;

              } else {

                this.chkverify = true;

                this.ca = false;
                this.us = false;
                this.gb = false;
                this.za = true;
                this.er = false;
                this.za_bankname = benificiary_details[0].ZA_bank_name;
                this.za_accountno = benificiary_details[0].ZA_account_no;
                this.za_phoneno = benificiary_details[0].ZA_phone_no;
              }

            } else if (benificiary_details[0].currency == "28") {

              this.currency = benificiary_details[0].currency;
              this.disflage = benificiary_details[0].flage_iso;
              this.phonecode = benificiary_details[0].country_code;
              this.recipientType = benificiary_details[0].recipient_type;

              if (this.recipientType == 'personal') {
                this.text = "Full name of the account holder";
              } else {
                this.text = "Name of the business / charity";
              }

              this.account_holder = benificiary_details[0].name_business;
              this.phone = benificiary_details[0].phoneno;
              this.comemail = benificiary_details[0].email;

              let cverify = benificiary_details[0].chkverify;
              if (cverify == 0) {

                this.chkverify = false;

                this.ca = false;
                this.us = false;
                this.gb = false;
                this.za = false;
                this.er = false;

              } else {

                this.chkverify = true;

                this.ca = false;
                this.us = false;
                this.gb = false;
                this.za = false;
                this.er = true;
                this.er_iban = benificiary_details[0].ER_iban;
              }

            }
          }
        )

        this.text = "Full name of the account holder";

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
        this.erruksortcode = true;
        this.errgb_accountno = true;
        this.errza_bankname = true;
        this.errza_accountno = true;
        this.errza_phoneno = true;
        this.errer_iban = true;
        this.errphone = true;
        this.errcomemail = true;

        this.routingno = "";
        this.us_accountno = "";
        this.us_accounttype = "";

        this.institutionno = "";
        this.transitno = "";
        this.ca_accountno = "";
        this.ca_accounttype = "";

        this.ukcode = "";
        this.gb_accountno = "";

        this.za_bankname = "";
        this.za_accountno = "";
        this.za_phoneno = "";

        this.er_iban = "";

        const getbcountry = `${this.hosturl + this.port + "/get_bcountry"}`;
        this.http.get(getbcountry).subscribe(
          (res: Response) => {
            this.benifcountry = res.json().get_bcountry;
          }
        )

        const getcountry = `${this.hosturl + this.port + "/country"}`;
        this.http.get(getcountry).subscribe(
          (res: Response) => {
            this.country = res.json().country;
          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
