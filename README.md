# EmailEngine Unified Inbox Demo

This demo app uses EmailEngine as the backend to show a unified mailbox that includes emails from multiple different email accounts.

![](https://cldup.com/RJlDzEyc1j.png)

> Listing emails from multiple accounts. Opening an unread email marks that email as seen in the original mailbox.

### Step 1. Install dependencies

```
$ npm install
```

### Step 2. Configure EmailEngine details

Edit [server.js](server.js) and modify the constants on top of the file.

```js
// URL to EmailEngine
const EMAILENGINE_API_URL = 'http://127.0.0.1:3000';
// Access token for API requests
const EMAILENGINE_ACCESS_TOKEN = '';
// A list of EmailEngine account ID values to include in the unified inbox
const UNIFIED_ACCOUNTS = ['account1', 'account2', 'account3'];
```

### Step 3. Run the app

Run the app

```
$ node server.js
```

Open the app in the browser: [http://127.0.0.1:8080](http://127.0.0.1:8080)

## License

**MIT**
