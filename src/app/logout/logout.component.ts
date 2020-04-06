import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router) { }

  removeitem = function () {
    localStorage.removeItem('type');
    localStorage.removeItem('custid');
    localStorage.removeItem('sendid');
    localStorage.removeItem('adminid');
    localStorage.removeItem('profile');
    localStorage.removeItem('username');
    localStorage.removeItem('accountid');
    localStorage.removeItem('email');
    localStorage.removeItem('kid');
    localStorage.removeItem("recipient");
    localStorage.removeItem("lsid");
    localStorage.removeItem("send_amount");
    localStorage.removeItem("send_currency");
    localStorage.removeItem('bid');
    localStorage.removeItem('load');
    localStorage.removeItem('lastname');
    localStorage.removeItem('transfer_type');
    localStorage.removeItem('paytype');
    localStorage.removeItem('role');
  }

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.removeitem();
    this.router.navigate(['/login']);
  }

}
