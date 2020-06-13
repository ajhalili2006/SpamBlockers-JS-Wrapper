# SpamBlockers API JavaScript Wrapper

The official JavaScript Wrapper of SpamBlockers API, forked from
the [SpamWatch API JavaScript Wrapper](https://github.com/SpamWatch/spamwatch-js), with some customizations.

## Changelog

### v0.2.0

* Updated the README to include changelog, available functions and credits, among other things.
* Renamed some functions for clarifications.

### v0.1.0

* Initial version of the package, as part of the development of [SpmBlockers API Server](https://gitlab.com/SpamBlockers/API-Server).
* Forked from [`github:SpamWatch/spamwatch-js`](https://github.com/SpamWatch-spamwatch-js)

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
const SpamBlockersApi = require('@spamblockers/api');
const token = process.env.SPAMBLOCKERS_API_TOKEN
const client = new SpamBlockersApi.Client(token);

(async () => {
    const ban = await client.queryBanStatus(777000);
    console.log(ban);
})();
```

In this example, when we ran this query, the resulting response will be:

```js
{
    ok: false,
    description: 'This user was whitelisted, so Telegram is not banned.'.
    userId: 777000,
    isBanned: false,
    banned_by: null,
    reason: null,
    timestamp: null
}
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

## Available Functions

As soon as the SpamWatch API wrapper for JavScript have new functions to use, we'll update our code here. For in a meanwhile,

| Category | Name | Permission Level | In this package | In SpamWatch API JS Wrapper | Supported Since (from the API wrapper version history) |
| --- | --- | --- | --- | --- | --- |
| Blacklist | Pulling the whole banlist | Root | `exportAllBans` | `getBans` | 0.1.0
| | Querying a user's ban status. | User | `queryBanStatus` | `getBan` | 0.1.0
| | Getting a list of banned IDs | User | **Unsupported, coming soon** | **Unsupported, coming soon.** | n/a |
| | Banning a user thru API | Sudo/Admin | `addNewGban` | `addBan` | 0.1.0
| | Batch banning users thru API. | Sudo/Admin | `batchGban` | `addBans` | 0.1.0
| | Unbanning a user thru API | Sudo/Admin | `removeGban` | `deleteBan` | 0.1.0
| API Tokens Management | Getting your token's metadata. | User | `pullSelfMeta` | `getSelf` | 0.1.0
| | Getting all tokens | Root | `getAllApiTokens` | `getTokens` | 0.1.0 |
| | Getting a specific token and its metadata | Root | `getApiTokenMetadata` | `getToken` | 0.1.0 |
| | Generating a new token | Sudo/Admin | `generateApiToken` | `createToken` | 0.1.0 |
| | Revoke a token | Root | `revokeApiToken` | `deleteToken` | 0.1.0 |
| Misc | Getting API version | No Authenication Needed | `version` | `version` | 0.1.0
| | Getting API stats | No Authenication Needed | `stats` | `stats` | 0.1.0

## Examples

For a list of examples for available functions listed above, plese see the `examples` directory of the packge's source code.

## Is this backwards-compartible with SpamWatch API?

Yes, you can call the SpamWatch API using the SpamBlockers API JS Wrapper, but you need to change the host to `https://api.spamwat.ch`, like this:

```js
const SpamBlockersApi = require('@spamblockers/api');
const token = process.env.SPAMBLOCKERS_API_TOKEN;
const host = "https://api.spmwat.ch";
const client = new SpamBlockersApi.Client(token);

(async () => {
    const ban = await client.queryBanStatus(777000);
    console.log(ban);
})();
```

## Credits

* [Andrew 'Twit' Lane](https://t.me/TwitFace), the author of `spamwatch` module.
