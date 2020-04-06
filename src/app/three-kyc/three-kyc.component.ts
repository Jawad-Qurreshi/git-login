import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';


@Component({
  selector: 'app-three-kyc',
  templateUrl: './three-kyc.component.html',
  styleUrls: ['./three-kyc.component.css'],
  providers: [DatePipe]
})
export class ThreeKycComponent implements OnInit {


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  durl: any = Constants.DOCURL;
  threeurl: any = Constants.DOCTHREEURL;
  foururl: any = Constants.DOCFOURURL;

  deviceInfo = null;

  docurl: any;

  form: any;

  ubillextention: any;
  lastubill: any;
  ubillrand: any;
  selfiextention: any;
  lastselfi: any;
  selfirand: any;

  errubill: any;
  errselfi: any;

  kycdata: any;
  view: any;

  billdata: any;

  ubillval: any;
  ubillphoto_name: any;
  ubill_photo: any;

  selfival: any;
  selfiphoto_name: any;
  selfi_photo: any;

  bfrontextention: any;
  blastfront: any;

  utilitybilldate: any;
  errbilldate: any;

  selfidata: any;
  slastfront: any;


  errcomment: any;
  comment: any;

  wait: any;

  browser: any;
  os: any;
  ip: any;

  @ViewChild('fileutilitybill') inpututilitybill: ElementRef;
  @ViewChild('fileselfi') inputselfi: ElementRef;

  options: DatepickerOptions = {
    locale: enLocale,
    addClass: 'form-control',
    displayFormat: 'DD-MMM-YYYY',
    barTitleIfEmpty: 'Select Date',
    placeholder: 'dd-----yyyy',
    addStyle: {
      padding: '12px',
      border: 'none',
      width: '100%'
    },
  };
  swait: boolean;

  constructor(private router: Router, private http: Http, private fb: FormBuilder, public datepipe: DatePipe, private deviceService: DeviceDetectorService) {
    this.createForm();
    this.epicFunction();
  }

  private headers = new Headers({ 'Content-type': 'application/json' });

  createForm() {
    this.form = this.fb.group({
      utilitybill: null,
      selfi: null
    });
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.browser = this.deviceInfo.browser;
    this.os = this.deviceInfo.os;
  }

  upload_utilitybill(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('utilitybill').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };

      this.ubillextention = file.name.split(".");
      this.lastubill = this.ubillextention[this.ubillextention.length - 1];
      this.ubillrand = this.getrand(0, 1000000);

      if (this.lastubill != "png" && this.lastubill != "jpg" && this.lastubill != "jpeg"
        && this.lastubill != "pdf" && this.lastubill != "docx" && this.lastubill != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file");
        this.errubill = false;
      }
    }
  }

  upload_selfi(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('selfi').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };

      this.selfiextention = file.name.split(".");
      this.lastselfi = this.selfiextention[this.selfiextention.length - 1];
      this.selfirand = this.getrand(0, 1000000);

      if (this.lastselfi != "png" && this.lastselfi != "jpg" && this.lastselfi != "jpeg"
        && this.lastselfi != "pdf" && this.lastselfi != "docx" && this.lastselfi != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file");
        this.errselfi = false;
      }

    }
  }

  second = function () {
    this.router.navigate(['/kyc-document-two']);
  }

  kyc_third = function (data) {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    const formModel = this.form.value;

    if (formModel.utilitybill == null) {
      this.errubill = false;
      alertify.error("Please Choose Utility Bill");
    } else {
      if (this.lastubill != "png" && this.lastubill != "jpg" && this.lastubill != "jpeg"
        && this.lastubill != "pdf" && this.lastubill != "docx" && this.lastubill != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of UTILITY BILL photo");
        this.errubill = false;
      } else {
        this.errubill = true;
      }
    }


    if (formModel.selfi == null) {
      this.errselfi = false;
      alertify.error("Please Choose Bank Statement");
    } else {
      if (this.lastselfi != "png" && this.lastselfi != "jpg" && this.lastselfi != "jpeg"
        && this.lastselfi != "pdf" && this.lastselfi != "docx" && this.lastselfi != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of SELFI WITH ID AND DATE photo");
        this.errselfi = false;
      } else {
        this.errselfi = true;
      }
    }

    let original = this.datepipe.transform(this.utilitybilldate, 'yyyy-MM-dd');
    var bill_timestamp = new Date(this.utilitybilldate).getTime();
    var cuurent_timestamp = new Date().getTime() - (90 * 24 * 60 * 60 * 1000);

    if (this.utilitybilldate == "") {
      this.errbilldate = false;
      alertify.error("Please Select Utility Bill Date");
    } else {
      if (cuurent_timestamp <= bill_timestamp) {
        this.errbilldate = true;
      } else {
        this.errbilldate = false;
        alertify.error("Sorry!, Utility Bill date must have validity of before 90 days from the current date, Please enter valid date.");
      }
    }

    // if (data.comment == "") {
    //   this.errcomment = false;
    //   alertify.error("Please Enter Comment");
    // } else {
    //   this.errcomment = true;
    // }

    if (this.errubill == true && this.errselfi == true && this.errbilldate == true) {

      this.wait = false;

      let thirdkyc = {
        "custid": custid,
        "billdate": original,
        "billval": formModel.utilitybill.value,
        "bill_photo": this.ubillrand + formModel.utilitybill.filename,
        "selfival": formModel.selfi.value,
        "selfi_photo": this.selfirand + formModel.selfi.filename,
        "comment": data.comment,
        "ip": this.ip,
        "browser": this.browser,
        "os": this.os
      }

      const url = `${this.hosturl + this.port + "/thirdkyc"}`;
      this.http.post(url, JSON.stringify(thirdkyc), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.wait = true;
            this.router.navigate(['kyc-document']);
            alertify.success("KYC Uploaded Successfully");
          }
        });

    }

  }

  save_kyc_third = function () {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    const formModel = this.form.value;

    if (formModel.utilitybill == null) {
      this.errubill = false;
      alertify.error("Please Choose Utility Bill");
    } else {
      if (this.lastubill != "png" && this.lastubill != "jpg" && this.lastubill != "jpeg"
        && this.lastubill != "pdf" && this.lastubill != "docx" && this.lastubill != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of UTILITY BILL photo");
        this.errubill = false;
      } else {
        this.errubill = true;
      }
    }


    if (formModel.selfi == null) {
      this.errselfi = false;
      alertify.error("Please Choose Bank Statement");
    } else {
      if (this.lastselfi != "png" && this.lastselfi != "jpg" && this.lastselfi != "jpeg"
        && this.lastselfi != "pdf" && this.lastselfi != "docx" && this.lastselfi != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of SELFI WITH ID AND DATE photo");
        this.errselfi = false;
      } else {
        this.errselfi = true;
      }
    }

    let original = this.datepipe.transform(this.utilitybilldate, 'yyyy-MM-dd');
    var bill_timestamp = new Date(this.utilitybilldate).getTime();
    var cuurent_timestamp = new Date().getTime() - (90 * 24 * 60 * 60 * 1000);

    if (this.utilitybilldate == "") {
      this.errbilldate = false;
      alertify.error("Please Select Utility Bill Date");
    } else {
      if (cuurent_timestamp <= bill_timestamp) {
        this.errbilldate = true;
      } else {
        this.errbilldate = false;
        alertify.error("Sorry!, Utility Bill date must have validity of before 90 days from the current date, Please enter valid date.");
      }
    }

    // if (data.comment == "") {
    //   this.errcomment = false;
    //   alertify.error("Please Enter Comment");
    // } else {
    //   this.errcomment = true;
    // }

    if (this.errubill == true && this.errselfi == true && this.errbilldate == true) {

      this.swait = false;

      let thirdkyc = {
        "custid": custid,
        "billdate": original,
        "billval": formModel.utilitybill.value,
        "bill_photo": this.ubillrand + formModel.utilitybill.filename,
        "selfival": formModel.selfi.value,
        "selfi_photo": this.selfirand + formModel.selfi.filename,
        "comment": this.comment,
        "ip": this.ip,
        "browser": this.browser,
        "os": this.os
      }

      const url = `${this.hosturl + this.port + "/thirdkyc"}`;
      this.http.post(url, JSON.stringify(thirdkyc), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.swait = true;

            var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
            var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

            const getkyc = `${this.hosturl + this.port + "/getkycdata/"}${custid}`;
            this.http.get(getkyc).subscribe(
              (res: Response) => {
                this.kycdata = res.json().customer;

                this.view = false;
                this.wait = true;
                this.swait = true;

                let ubildate = this.kycdata[0].bill_expiry_date;
                this.utilitybilldate = this.datepipe.transform(ubildate, 'yyyy-MM-dd');

                this.billdata = this.kycdata[0].utility_bill;
                this.ubillextention = this.billdata.split(".");
                this.blastfront = this.ubillextention[this.ubillextention.length - 1];

                this.selfidata = this.kycdata[0].selfie_id;
                this.selfiextention = this.selfidata.split(".");
                this.slastfront = this.selfiextention[this.selfiextention.length - 1];

                this.comment = this.kycdata[0].comment;

                this.docurl = this.durl + custid + "/";



              }
            )

          }
        });
    }
  }

  up_kyc_third = function (data) {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    const formModel = this.form.value;

    if (formModel.utilitybill == null) {
      this.bval = "";
      this.bphoto = "";
      this.errubill = true;
    } else {
      if (this.lastubill != "png" && this.lastubill != "jpg" && this.lastubill != "jpeg"
        && this.lastubill != "pdf" && this.lastubill != "docx" && this.lastubill != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of FRONTSIDE photo");
        this.errubill = false;
      } else {
        this.errubill = true;
      }
    }

    if (formModel.selfi == null) {
      this.sval = "";
      this.sphoto = "";
      this.errselfi = true;
    } else {
      if (this.lastselfi != "png" && this.lastselfi != "jpg" && this.lastselfi != "jpeg"
        && this.lastselfi != "pdf" && this.lastselfi != "docx" && this.lastselfi != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of FRONTSIDE photo");
        this.errselfi = false;
      } else {
        this.errselfi = true;
      }
    }

    let original = this.datepipe.transform(this.utilitybilldate, 'yyyy-MM-dd');
    var bill_timestamp = new Date(this.utilitybilldate).getTime();
    var cuurent_timestamp = new Date().getTime() - (90 * 24 * 60 * 60 * 1000);

    if (this.utilitybilldate == "") {
      this.errbilldate = false;
      alertify.error("Please Select Utility Bill Date");
    } else {
      if (cuurent_timestamp <= bill_timestamp) {
        this.errbilldate = true;
      } else {
        this.errbilldate = false;
        alertify.error("Sorry!, Utility Bill date must have validity of before 90 days from the current date, Please enter valid date.");
      }
    }

    // if (data.comment == "") {
    //   this.errcomment = false;
    //   alertify.error("Please Enter Comment");
    // } else {
    //   this.errcomment = true;
    // }

    if (this.errubill == true && this.errselfi == true && this.errbilldate == true) {

      this.wait = false;

      let thirdkyc = {
        "custid": custid,
        "bill_expiry_date": original,
        "billval": (formModel.utilitybill) ? formModel.utilitybill.value : this.bval,
        "bill_photo": (formModel.utilitybill) ? this.ubillrand + formModel.utilitybill.filename : this.bphoto,
        "selfival": (formModel.selfi) ? formModel.selfi.value : this.sval,
        "selfi_photo": (formModel.selfi) ? this.selfirand + formModel.selfi.filename : this.sphoto,
        "comment": data.comment,
        "ip": this.ip,
        "browser": this.browser,
        "os": this.os
      }

      const url = `${this.hosturl + this.port + "/upthirdkyc"}`;
      this.http.post(url, JSON.stringify(thirdkyc), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {

            this.wait = true;
            alertify.success("KYC Uploaded Successfully..!");
            this.router.navigate(['kyc-document']);
          }
        });
    }

  }

  save_up_kyc_third = function () {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    const formModel = this.form.value;

    if (formModel.utilitybill == null) {
      this.bval = "";
      this.bphoto = "";
      this.errubill = true;
    } else {
      if (this.lastubill != "png" && this.lastubill != "jpg" && this.lastubill != "jpeg"
        && this.lastubill != "pdf" && this.lastubill != "docx" && this.lastubill != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of FRONTSIDE photo");
        this.errubill = false;
      } else {
        this.errubill = true;
      }
    }

    if (formModel.selfi == null) {
      this.sval = "";
      this.sphoto = "";
      this.errselfi = true;
    } else {
      if (this.lastselfi != "png" && this.lastselfi != "jpg" && this.lastselfi != "jpeg"
        && this.lastselfi != "pdf" && this.lastselfi != "docx" && this.lastselfi != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of FRONTSIDE photo");
        this.errselfi = false;
      } else {
        this.errselfi = true;
      }
    }

    let original = this.datepipe.transform(this.utilitybilldate, 'yyyy-MM-dd');
    var bill_timestamp = new Date(this.utilitybilldate).getTime();
    var cuurent_timestamp = new Date().getTime() - (90 * 24 * 60 * 60 * 1000);

    if (this.utilitybilldate == "") {
      this.errbilldate = false;
      alertify.error("Please Select Utility Bill Date");
    } else {
      if (cuurent_timestamp <= bill_timestamp) {
        this.errbilldate = true;
      } else {
        this.errbilldate = false;
        alertify.error("Sorry!, Utility Bill date must have validity of before 90 days from the current date, Please enter valid date.");
      }
    }

    // if (data.comment == "") {
    //   this.errcomment = false;
    //   alertify.error("Please Enter Comment");
    // } else {
    //   this.errcomment = true;
    // }

    if (this.errubill == true && this.errselfi == true && this.errbilldate == true) {

      this.swait = false;

      let thirdkyc = {
        "custid": custid,
        "bill_expiry_date": original,
        "billval": (formModel.utilitybill) ? formModel.utilitybill.value : this.bval,
        "bill_photo": (formModel.utilitybill) ? this.ubillrand + formModel.utilitybill.filename : this.bphoto,
        "selfival": (formModel.selfi) ? formModel.selfi.value : this.sval,
        "selfi_photo": (formModel.selfi) ? this.selfirand + formModel.selfi.filename : this.sphoto,
        "comment": this.comment,
        "ip": this.ip,
        "browser": this.browser,
        "os": this.os
      }

      const url = `${this.hosturl + this.port + "/upthirdkyc"}`;
      this.http.post(url, JSON.stringify(thirdkyc), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {

            this.swait = true;
          }
        });
    }

  }

  getrand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  clear = function () {
    localStorage.removeItem("fname");
    localStorage.removeItem("lname");
    localStorage.removeItem("phone");
    localStorage.removeItem("dob");
    localStorage.removeItem("state");
    localStorage.removeItem("streetaddress");
    localStorage.removeItem("occupation");
    localStorage.removeItem("country");
    localStorage.removeItem("city");
    localStorage.removeItem("postalcode");
    localStorage.removeItem("doctype");
    localStorage.removeItem("docnumber");
    localStorage.removeItem("issue_date");
    localStorage.removeItem("expiry_date");
    localStorage.removeItem("address_as_doc");
    localStorage.removeItem("frontval");
    localStorage.removeItem("frontside_photo");
    localStorage.removeItem("backval");
    localStorage.removeItem("backside_photo");
    localStorage.removeItem("writeval");
    localStorage.removeItem("writer_photo");
    localStorage.removeItem("oldbill");
    localStorage.removeItem("oldbpath");
    localStorage.removeItem("oldfpath");
    localStorage.removeItem("oldselfi");
    localStorage.removeItem("oldwpath");
  }

  errorvariable = function () {
    this.errubill = true;
    this.errselfi = true;
    this.errbilldate = true;
    this.errcomment = true;

    this.comment = "";
  }

  ngOnInit() {


    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    var id = localStorage.getItem("custid");

    if (id != null) {

      var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
      var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

      const getkyc = `${this.hosturl + this.port + "/getkycdata/"}${custid}`;
      this.http.get(getkyc).subscribe(
        (res: Response) => {
          this.kycdata = res.json().customer;

          if (this.kycdata[0].utility_bill == "") {
            this.view = true;
            this.wait = true;
            this.swait = true;
          } else {
            this.view = false;
            this.wait = true;
            this.swait = true;

            let ubildate = this.kycdata[0].bill_expiry_date;
            this.utilitybilldate = this.datepipe.transform(ubildate, 'yyyy-MM-dd');

            this.billdata = this.kycdata[0].utility_bill;
            this.ubillextention = this.billdata.split(".");
            this.blastfront = this.ubillextention[this.ubillextention.length - 1];

            this.selfidata = this.kycdata[0].selfie_id;
            this.selfiextention = this.selfidata.split(".");
            this.slastfront = this.selfiextention[this.selfiextention.length - 1];

            this.comment = this.kycdata[0].comment;

            this.docurl = this.durl + custid + "/";


          }
        }
      )

      this.http.get("https://jsonip.com/").subscribe(
        (res: Response) => {
          this.ip = res.json().ip;
        });

      this.errorvariable();

    } else {
      this.router.navigate(['/login']);
    }

  }

}
