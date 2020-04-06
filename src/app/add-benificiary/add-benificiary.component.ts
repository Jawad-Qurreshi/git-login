import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-add-benificiary',
  templateUrl: './add-benificiary.component.html',
  styleUrls: ['./add-benificiary.component.css']
})
export class AddBenificiaryComponent implements OnInit {


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


  fields: any;
  formdata: any;

  text: any;

  us: any;
  ca: any;
  gb: any;
  za: any;
  er: any;

  bankcountry: any;
  custid: any;

  disflage: any;

  phone: any;
  errphone: any;
  phonecode: any;

  address: any;
  erraddress: any;
  comemail: string;
  errcomemail: boolean;

  chkverify: any;

  deviceInfo = null;
  browser: any;
  os: any;
  ip: any;

  constructor(private http: Http, private router: Router, private deviceService: DeviceDetectorService) {
    this.epicFunction();
  }
  private headers = new Headers({ 'Content-type': 'application/json' });

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.browser = this.deviceInfo.browser;
    this.os = this.deviceInfo.os;
  }

  benificiary = function (data) {

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
            "ca_accounttype": data.ca_accounttype,
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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
            "ca_accounttype": "",
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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
            "us_accounttype": data.us_accounttype,
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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
            "us_accounttype": "",
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(usdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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
            "gb_accountno": data.gb_accountno,
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(audata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "gb_ukcode": "",
            "gb_accountno": "",
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(audata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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
            "za_phoneno": data.za_phoneno,
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(zadata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "za_bankname": "",
            "za_accountno": "",
            "za_phoneno": "",
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(zadata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "er_iban": data.er_iban,
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(erdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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
            "custid": this.custid,
            "currency": data.currency,
            "recipienttype": data.recipientType,
            "name_business": data.account_holder,
            "phoneno": data.phone,
            "email": data.comemail,
            "chkverify": this.chkverify,
            "er_iban": "",
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/addbenificiary"}`;
          this.http.post(url, JSON.stringify(erdata), { headers: this.headers }).toPromise()
            .then((res: Response) => {
              if (res.json().success) {
                alertify.success(res.json().msg);
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

        this.currency = "";
        this.disflage = "";
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
        this.phonecode = "";

        this.comemail = "";
        this.errcomemail = true;

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

        this.http.get("https://jsonip.com/").subscribe(
          (res: Response) => {
            this.ip = res.json().ip;
          });

      }
    } else {
      this.router.navigate(['/login']);
    }
  }

}
