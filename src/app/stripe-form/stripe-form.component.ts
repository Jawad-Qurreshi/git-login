import { Component, OnInit } from '@angular/core';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';

@Component({
  selector: 'app-stripe-form',
  templateUrl: './stripe-form.component.html',
  styleUrls: ['./stripe-form.component.css']
})
export class StripeFormComponent implements OnInit {

  private stripeCheckoutHandler: StripeCheckoutHandler;

  constructor(private stripeCheckoutLoader: StripeCheckoutLoader) { }

  public ngAfterViewInit() {
    this.stripeCheckoutLoader.createHandler({
      key: 'pk_test_oi0sKPJYLGjdvOXOM8tE8cMa',
      token: (token) => {
        console.log(token);
      },
    }).then((handler: StripeCheckoutHandler) => {
      this.stripeCheckoutHandler = handler;
    });
  }

  public onClickBuy() {
    this.stripeCheckoutHandler.open({
      amount: 1500,
      currency: 'EUR',
    }).catch((err) => {
      if (err == 'stripe_closed') {
        console.log("cancel");
      }
    });
  }

  ngOnInit() {
  }

}
