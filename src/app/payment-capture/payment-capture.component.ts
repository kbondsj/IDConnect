import { Component } from '@angular/core';

const template=
`
  <div *ngIf="invalidError" style="color:red">
    {{ invalidError.message }}
  </div>

  <stripe-card #stripeCard
    (catch) = "onStripeError($event)"
    [(complete)] = "cardDetailsFilledOut"
    [(invalid)] = "invalidError"
    (cardMounted) = "cardCaptureReady = 1"
    (paymentMethodChange) = "setPaymentMethod($event)"
    (tokenChange) = "setStripeToken($event)"
    (sourceChange) = "setStripeSource($event)"
  ></stripe-card>

  <button type="button" (click)="stripeCard.createPaymentMethod(extraData)">createPaymentMethod</button>
  <button type="button" (click)="stripeCard.createSource(extraData)">createSource</button>
  <button type="button" (click)="stripeCard.createToken(extraData)">createToken</button>
`

@Component({
  selector: 'app-payment-capture',
  template: '',
  styleUrls: ['./payment-capture.component.scss']
})
export class PaymentCaptureComponent {

  cardCaptureReady = false
  //invalidError = { message : ""};

  onStripeInvalid( error: Error ){
    console.log('Validation Error', error)
  }

  onStripeError( error: Error ){
    console.error('Stripe error', error)
  }

  setPaymentMethod( token: stripe.paymentMethod.PaymentMethod ){
    console.log('Stripe Payment Method', token)
  }

  setStripeToken( token: stripe.Token ){
    console.log('Stripe Token', token)
  }

  setStripeSource( source: stripe.Source ){
    console.log('Stripe Source', source)
  }
}
