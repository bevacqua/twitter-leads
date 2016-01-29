# twitter-leads

> Pull list of leads from a Twitter Ads Lead Generation Card

# Installation

```shell
$ npm install --save twitter-leads
```

# Usage

The example shown below will pull a list of leads from Twitter Ads.

```js
var leads = require('twitter-leads');

leads({ username, password, ads, card }, done);

function done (err, leads) {
  // handle response
}
```

# API

# `leads(options, done)`

Posts an article on HN by making a series of requests against their website. Takes some `options`, detailed below.

Property   | Description
-----------|------------------------------------------------------------------------------------
`username` | Your Twitter username, used to authenticate.
`password` | Your Twitter password, used to authenticate.
`ads`      | Your Twitter Ads account ID. Find it by logging into [ads.twitter.com](https://ads.twitter.com).
`card`     | The Twitter Card ID for the Lead Generation card you want to download leads for.
`since`    | _Optional._ Leads generated before the `since` date won't be returned

When the requests against Twitter are done, the `done` callback will be invoked with two arguments.

- `err` will have an error if one occurred, and `null` otherwise
- `leads` will be the lead data as an array, where each entry contains the following fields:
  - `time` is the `Date` when a user interacted with your card
  - `email` is their email address, e.g `hello@ponyfoo.com`
  - `name` is their full user name, e.g: `Nicolás Bevacqua`
  - `handle` is their handle, e.g: `@nzgb`

# License

MIT
