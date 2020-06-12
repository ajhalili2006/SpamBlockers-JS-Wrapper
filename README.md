# SpamBlockers API JavaScript Wrapper

The official JavaScript Wrapper of SpamBlockers API, forked from
the [SpamWatch API JavaScript Wrapper](https://github.com/SpamWatch/spamwatch-js), with some customizations.

## Installtion

Just install the package with `npm i`, like this:

```sh
## This will save to your package.json, just in case you publish
## your source code KEK.
npm i @spamblockers/api --save
```

After installation, you can just require and call API requests, like [this one below](#basic-usage).

### With SpamWatch API JS Wrapper

As usual, install it with `npm`.

```sh
## This will save to your package.json, just in case you publish
## your source code KEK.
npm i spamwatch --save
```

After installation, you can just require and call API requests, like [this one below](#using-spamwatch-js-wrapper).


## Basic Usage

```js
const SpamBlockersApi = require('@SpamBlockers/API');
const token = process.env.SPAMBLOCKERS_API_TOKEN
const client = new SpamBlockersApi.Client(token);

(async () => {
    const ban = await client.getBan(777000);
    console.log(ban);
})();
```

### Using SpamWatch JS Wrapper

This may be different, because you need to point `host` to SpamBlockers API host.

```js
const SpamWatch = require('spamwatch');
const SpamBlockersApi = 'https://api.spamblockers.bot';
const token = process.env.SPAMBLOCKERS_API_TOKEN;
const client = new SpamBlockersApi.Client(token, SpamBlockersApi);

(async () => {
    const ban = await client.queryBanStatus(777000);
    console.log(ban);
})();
```

## Is this backwards-compartible with SpamWatch API?

Yes, you can call the SpamWatch API, but you need to change the host to `https://api.spamwat.ch`.
