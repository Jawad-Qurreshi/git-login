import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { routes } from './app.router';

import { NgxPaginationModule } from 'ngx-pagination';
import { StripeCheckoutModule } from 'ng-stripe-checkout';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { ParticlesModule } from 'angular-particle';

import { FilterPipe } from './filter.pipe';
import { SafeHtmlPipe } from './app.html';


import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme)

import { NgDatepickerModule } from 'ng2-datepicker';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
} from "angular-6-social-login";

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("431897019126-8vcduu7q3s95eu28ed455aqm8o8ce4q1.apps.googleusercontent.com")
        // provider: new GoogleLoginProvider("99628802426-qs6v28h0uq3n97r0a0tn330vok10761d.apps.googleusercontent.com")
      }
    ]
  );
  return config;
}

import { UiSwitchModule } from 'ngx-ui-switch';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KycDocumentComponent } from './kyc-document/kyc-document.component';
import { OneKycComponent } from './one-kyc/one-kyc.component';
import { TwoKycComponent } from './two-kyc/two-kyc.component';
import { ThreeKycComponent } from './three-kyc/three-kyc.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { SendMoneyTwoComponent } from './send-money-two/send-money-two.component';
import { SendMoneyThreeComponent } from './send-money-three/send-money-three.component';
import { SendMoneyFourComponent } from './send-money-four/send-money-four.component';
import { SendMoneyFiveComponent } from './send-money-five/send-money-five.component';
import { ReferComponent } from './refer/refer.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SingleTransactionComponent } from './single-transaction/single-transaction.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ReactivateComponent } from './reactivate/reactivate.component';
import { ActiveComponent } from './active/active.component';
import { MDashboardComponent } from './m-dashboard/m-dashboard.component';
import { TwoAuthComponent } from './two-auth/two-auth.component';
import { AuthComponent } from './auth/auth.component';
import { MUserComponent } from './m-user/m-user.component';
import { MTransactionComponent } from './m-transaction/m-transaction.component';
import { MSingleTransactionComponent } from './m-single-transaction/m-single-transaction.component';
import { MIkycComponent } from './m-ikyc/m-ikyc.component';
import { MSingleIkycComponent } from './m-single-ikyc/m-single-ikyc.component';
import { MTwoAuthComponent } from './m-two-auth/m-two-auth.component';
import { MAuthComponent } from './m-auth/m-auth.component';
import { MydetailsComponent } from './mydetails/mydetails.component';
import { MybeneficiaryComponent } from './mybeneficiary/mybeneficiary.component';
import { EditBenificiaryComponent } from './edit-benificiary/edit-benificiary.component';
import { AddBenificiaryComponent } from './add-benificiary/add-benificiary.component';
import { StripeFormComponent } from './stripe-form/stripe-form.component';
import { MBeneficiaryCountryComponent } from './m-beneficiary-country/m-beneficiary-country.component';
import { MEditBcountryComponent } from './m-edit-bcountry/m-edit-bcountry.component';
import { RefComponent } from './ref/ref.component';
import { SettingComponent } from './setting/setting.component';
import { RechargeComponent } from './recharge/recharge.component';
import { MAddStateComponent } from './m-add-state/m-add-state.component';
import { MAddCityComponent } from './m-add-city/m-add-city.component';
import { MEditUserComponent } from './m-edit-user/m-edit-user.component';
import { AgentTransactionComponent } from './agent-transaction/agent-transaction.component';
import { AgentSingleTransactionComponent } from './agent-single-transaction/agent-single-transaction.component';
import { AgentComponent } from './agent/agent.component';
import { FaqComponent } from './faq/faq.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MLoginHistoryComponent } from './m-login-history/m-login-history.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { MChangePasswordComponent } from './m-change-password/m-change-password.component';
import { WirePaymentComponent } from './wire-payment/wire-payment.component';
import { EnteracTransferComponent } from './enterac-transfer/enterac-transfer.component';
import { MGraphSettingComponent } from './m-graph-setting/m-graph-setting.component';
import { MEditChartComponent } from './m-edit-chart/m-edit-chart.component';
import { VsmcCheckoutComponent } from './vsmc-checkout/vsmc-checkout.component';
import { AmexCheckoutComponent } from './amex-checkout/amex-checkout.component';
import { ZipcoPaymentComponent } from './zipco-payment/zipco-payment.component';
import { MEosaddressComponent } from './m-eosaddress/m-eosaddress.component';
import { MEditEosaddressComponent } from './m-edit-eosaddress/m-edit-eosaddress.component';
import { WalletComponent } from './wallet/wallet.component';
import { AddMoneyComponent } from './add-money/add-money.component';
import { MoneyCheckoutComponent } from './money-checkout/money-checkout.component';
import { MPromocodeComponent } from './m-promocode/m-promocode.component';
import { MAddPromocodeComponent } from './m-add-promocode/m-add-promocode.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    KycDocumentComponent,
    OneKycComponent,
    TwoKycComponent,
    ThreeKycComponent,
    SendMoneyComponent,
    SendMoneyTwoComponent,
    SendMoneyThreeComponent,
    SendMoneyFourComponent,
    SendMoneyFiveComponent,
    ReferComponent,
    TransactionComponent,
    SingleTransactionComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ForgotpasswordComponent,
    ChangepasswordComponent,
    ReactivateComponent,
    ActiveComponent,
    FilterPipe,
    SafeHtmlPipe,
    MDashboardComponent,
    TwoAuthComponent,
    AuthComponent,
    MUserComponent,
    MTransactionComponent,
    MSingleTransactionComponent,
    MIkycComponent,
    MSingleIkycComponent,
    MTwoAuthComponent,
    MAuthComponent,
    MydetailsComponent,
    MybeneficiaryComponent,
    EditBenificiaryComponent,
    AddBenificiaryComponent,
    StripeFormComponent,
    MBeneficiaryCountryComponent,
    MEditBcountryComponent,
    RefComponent,
    SettingComponent,
    RechargeComponent,
    MAddStateComponent,
    MAddCityComponent,
    MEditUserComponent,
    AgentTransactionComponent,
    AgentSingleTransactionComponent,
    AgentComponent,
    FaqComponent,
    CheckoutComponent,
    MLoginHistoryComponent,
    LoginHistoryComponent,
    MChangePasswordComponent,
    WirePaymentComponent,
    EnteracTransferComponent,
    MGraphSettingComponent,
    MEditChartComponent,
    VsmcCheckoutComponent,
    AmexCheckoutComponent,
    ZipcoPaymentComponent,
    MEosaddressComponent,
    MEditEosaddressComponent,
    WalletComponent,
    AddMoneyComponent,
    MoneyCheckoutComponent,
    MPromocodeComponent,
    MAddPromocodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    routes,
    SocialLoginModule,
    NgxPaginationModule,
    StripeCheckoutModule,
    DeviceDetectorModule.forRoot(),
    ParticlesModule,
    FusionChartsModule,
    NgDatepickerModule,
    UiSwitchModule.forRoot({
      size: 'small'
    })
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
    ,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
