author: Joyce
id: paypal
summary: Get Started with PayPal REST APIs
categories: Getting-Started
environments: web
status: Published
feedback link: https://github.com/loopDelicious/pmquickstarts
tags: Getting Started, Developer

# Get Started with PayPal REST APIs

<!-- ------------------------ -->

## Overview

Duration: 1

> aside negative
> _This tutorial was originally published [here](https://developer.paypal.com/api/rest/postman/)._

Use Postman to explore PayPal's REST APIs without a developer account. You can customize requests and receive responses for any of PayPal's core APIs.

To do more with Postman:

- Create your own fork of the collection
- Link your collection to your PayPal [Developer Dashboard](https://developer.paypal.com/developer/applications) account
- Start making API calls

### Prerequisites

- Create a PayPal developer account on the [Developer Dashboard](https://developer.paypal.com/developer/applications)
- [Sign up](https://identity.getpostman.com/signup) for a free Postman account, and then [sign in](https://go.postman.co/).
- [Download and install](https://www.postman.com/downloads/postman-agent/) the Postman desktop agent, which will enable you to use the web version of Postman

### What You’ll Learn

- Authorize the PayPal API
- Start making API calls with Postman
- Capture payments in both your personal and business sandbox accounts

### What You’ll Build

- A Postman Collection with authorized API requests

<!-- ------------------------ -->

## Fork the PayPal Postman collection

Duration: 1

1. Sign in to your [Postman](https://www.postman.com/) account.
1. Select the Run in Postman below.
   <br/>
   [![Fork the PayPal collection](_shared_assets/button.svg)](https://god.gw.postman.com/run-collection/19024122-92a85d0e-51e7-47da-9f83-c45dcb1cdf24?action=collection%2Ffork&collection-url=entityId%3D19024122-92a85d0e-51e7-47da-9f83-c45dcb1cdf24%26entityType%3Dcollection%26workspaceId%3D345300e6-346e-42e0-aed1-53717919aef0#?env%5BPayPal%20Override%20Env%5D=W3sia2V5IjoiUGxlYXNlIE5vdGUgLS0+IiwidmFsdWUiOiI8IFBheVBhbCBQdWJsaWMgQ29sbGVjdGlvbiBjb21lcyB3aXRoIGRlZmF1bHQgcHVibGljIHNldCBvZiBjcmVkZW50aWFscyBzdG9yZWQgYXQgdGhlIENvbGxlY3Rpb24gbGV2ZWwuIFxuVGhpcyBlbnZpcm9ubWVudCBvdmVycmlkZXMgdGhvc2UgZGVmYXVsdCB2YXJpYWJsZXMuIFlvdSBtYXkgYnJpbmcgeW91ciBvd24gY3JlZGVudGlhbHMgZnJvbSBQYXlQYWwgRGV2ZWxvcGVyIERhc2hib2FyZCBhbmQgcGFzdGUgdGhlbSBoZXJlLiBEbyBub3QgZm9yZ290IHRvIGVuYWJsZSB0aGUgdmFpYWJsZSBieSBjaGVja2luZyB0aGUgYm94IGFuZCBoaXQgXCJTYXZlXCIgYmVmb3JlIGludm9raW5nIHRoZSBQYXlQYWwgQVBJcy4gPiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiY2xpZW50X2lkIiwidmFsdWUiOiI8IGNvcHkgY3JlZGVudGlhbHMgZnJvbSB5b3VyIGRldmVsb3Blci5wYXlwYWwuY29tIGFuZCBwYXN0ZSB0aGVtIGhlcmUgPiIsImVuYWJsZWQiOmZhbHNlfSx7ImtleSI6ImNsaWVudF9zZWNyZXQiLCJ2YWx1ZSI6IjwgY29weSBjcmVkZW50aWFscyBmcm9tIHlvdXIgZGV2ZWxvcGVyLnBheXBhbC5jb20gYW5kIHBhc3RlIHRoZW0gaGVyZSA+IiwiZW5hYmxlZCI6ZmFsc2V9LHsia2V5IjoiYmFzZV91cmwiLCJ2YWx1ZSI6Imh0dHBzOi8vYXBpLW0ucGF5cGFsLmNvbSIsImVuYWJsZWQiOmZhbHNlfV0=)
1. Select Fork Collection.
1. Name your fork and select a workspace.

<!-- ------------------------ -->

## Authentication

Duration: 3

An access token is automatically generated using a default `client_id` and `client_secret`. Replace the default access tokens with your own `client_id` and `client_secret` from the [Developer Dashboard](https://developer.paypal.com/developer/applications).

1. On the Developer Dashboard, find your `client_id` and `client_secret` under Dashboard > My Apps & Credentials.
1. In Postman, select your fork of the PayPal collection.
1. Under the Variables tab, enter your `client_id` and `client_secret`.
1. Select Save.

A pre-request script generates and manages the `access_token` automatically. Use the `access_token` allows you to call any API in the collection.

<!-- ------------------------ -->

## Start making API calls with Postman

Duration: 4

This example uses the Orders API to create an order and capture payment using [sandbox accounts](https://developer.paypal.com/developer/accounts) linked to your Developer Dashboard account. To find your sandbox account credentials, log into the Developer Dashboard and select Sandbox > Accounts.

To create an order:

1. In your Postman workspace, navigate to your fork of the PayPal collection.
1. Select Orders > Create Order > Send. On a successful call, the API returns a 201 order created response code.
1. Find the approve link in the response.
1. Open the approve link in a browser.
1. Log in with your Developer Dashboard sandbox personal account credentials.

### Capture payments

Capture payments in both your personal and business sandbox accounts as follows:

1. Find the `id` in the response of the order you created and copy the value.
1. In the left panel, select your fork of the PayPal collection.
1. In the Variables tab, enter the value you copied in the `order_id` field.
1. Select Orders > Capture payment for order.
1. Select Send. The API returns an HTTP `201 order created` response code in response to a successful call.

<!-- ------------------------ -->

## Next Steps

Duration: 1

The [PayPal REST API](https://developer.paypal.com/api/rest/) is organized around transaction workflows, including: orders, payments, subscriptions, invoicing, and disputes. Check out these additional resources.

- Review the [documentation](https://developer.paypal.com/api/rest/requests/).
- Learn more about [OAuth 2.0 authentication](https://developer.paypal.com/api/rest/authentication/)
- [PayPal public workspace on Postman](https://www.postman.com/paypal/workspace/paypal-public-api-workspace/overview)
