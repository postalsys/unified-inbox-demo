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

## API endpoints used

### Unified search `/v1/unified/search`

See the API docs for Unified search [here](https://api.emailengine.app/#operation/postV1UnifiedSearch).

No special options are used, except the `page` query argument.

### Message details `/v1/account/{account}/message/{message}`

See the API docs for message details request [here](https://api.emailengine.app/#operation/getV1AccountAccountMessageMessage).

Params used in the request:

-   **account** – value from the `messages[].account` property in the unified search results
-   **message** – value from the `messages[].id` property in the unified search results

Query arguments used in the request

-   **documentStore** – set to `"true"` to retrieve message info from ElasticSearch instead of IMAP
-   **webSafeHtml** – set to `"true"` to make sure the output includes the `text.html` property that can be injected straight to the web page. If not set, then the result might only include plaintext content, or the html content might include tags that break the structure of the resulting HTML page.
-   **textType** – set to `"*"` to make sure that all text content (both the HTML, or if it is missing, then plaintext) is retrieved from the backend
-   **markAsSeen** – set to `"true"` to make sure that if the email was unseen, then it gets marked as seen as we disaply it in the browser

## License

**MIT**
