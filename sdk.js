const axios = require('axios');
const packageData = require('./package.json');

class EmailEngine {
    static create(opts = {}) {
        return new EmailEngine(opts);
    }

    constructor(opts = {}) {
        this.apiUrl = opts.apiUrl;
        this.accessToken = opts.accessToken;
    }

    // Helper function to prepare EmailEngine API URL
    getRequestUrl(relativeUrl, opts = {}) {
        const { params, query } = opts;
        relativeUrl = relativeUrl || '';

        if (!/^\//.test(relativeUrl)) {
            relativeUrl = '/' + relativeUrl;
        }

        if (!/^\/v1/.test(relativeUrl)) {
            relativeUrl = '/v1' + relativeUrl;
        }

        // replace path param variables "/path/{user}/action" -> "/path/username/action"
        if (params) {
            relativeUrl = relativeUrl.replace(/\{([^\}]+)\}/g, (match, key) => {
                return params[key] && typeof params[key] === 'string' ? encodeURIComponent(params[key]) : match;
            });
        }

        let urlObj = new URL(relativeUrl, this.apiUrl);

        // add query arguments
        for (let key of Object.keys(query || {})) {
            let value = query[key];
            switch (typeof value) {
                case 'boolean':
                case 'number':
                    value = value.toString();
                    break;
            }
            urlObj.searchParams.append(key, value);
        }

        return urlObj.href;
    }

    // Helper function to run API requests against EmailEngine
    async runRequest(url, method, opts = {}) {
        const { body } = opts;

        const requestUrl = this.getRequestUrl(url, opts);
        method = (method || '').toString() || (body ? 'post' : 'get');

        let headers = {
            'User-Agent': `${packageData.name}/${packageData.version}`
        };

        if (this.accessToken) {
            headers.Authorization = `Bearer ${this.accessToken}`;
        }

        if (body) {
            headers['Content-Type'] = 'application/json';
        }

        const res = await axios({
            method,
            url: requestUrl,
            data: body || null,
            headers
        });

        if (!res) {
            throw new Error(`Failed to run API ${method.toUpperCase()} request`);
        }

        if (!res.status || res.status < 200 || res.status >= 300) {
            throw new Error(`Invalid response status ${res.status}`);
        }

        return res.data;
    }

    async unifiedSearch(accounts, page = 0) {
        const body = {};
        const query = {
            page
        };

        if (accounts && accounts.length) {
            body.accounts = accounts;
        }

        body.paths = ['INBOX'];

        body.search = {}; //match all

        return await this.runRequest('/v1/unified/search', 'POST', { query, body });
    }

    async getMessage(account, message) {
        let messageData = await this.runRequest('/v1/account/{account}/message/{message}', 'GET', {
            params: {
                account,
                message
            },
            query: {
                documentStore: true,
                webSafeHtml: true,
                textType: '*',
                markAsSeen: true
            }
        });
        return messageData;
    }
}

module.exports = { EmailEngine };
