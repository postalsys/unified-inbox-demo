const { EmailEngine } = require('./sdk');
const Path = require('path');
const fastify = require('fastify')({ logger: true });

// URL to EmailEngine
const EMAILENGINE_API_URL = 'http://127.0.0.1:3000';
// Access token for API requests
const EMAILENGINE_ACCESS_TOKEN = '';
// A list of EmailEngine account ID values to include in the unified inbox
// An empty list includes _all_ email accounts
const UNIFIED_ACCOUNTS = []; // ["account1", "account2", "account3"]

const WEB_PORT = 8080;

const ee = EmailEngine.create({
    apiUrl: EMAILENGINE_API_URL,
    accessToken: EMAILENGINE_ACCESS_TOKEN
});

fastify.register(require('@fastify/view'), {
    engine: {
        handlebars: require('handlebars')
    },
    root: Path.join(__dirname, 'views'),
    layout: '/templates/layout',
    viewExt: 'hbs',
    propertyName: 'render'
});

fastify.register(require('@fastify/static'), {
    root: Path.join(__dirname, 'public'),
    prefix: '/public/'
});

// route to list mailbox content
fastify.route({
    method: 'GET',
    url: '/',
    handler: async (req, reply) => {
        const page = req.query.page || 0;

        const { total, pages, messages } = await ee.unifiedSearch(UNIFIED_ACCOUNTS, page);

        const hasNextPage = page + 1 < pages;
        const hasPrevPage = page > 0;

        let prevPageUrl;
        let nextPageUrl;

        if (hasPrevPage) {
            let url = new URL('/', 'http://localhost');
            url.searchParams.append('page', page - 1);
            prevPageUrl = url.pathname + url.search;
        }

        if (hasNextPage) {
            let url = new URL('/', 'http://localhost');
            url.searchParams.append('page', page + 1);
            nextPageUrl = url.pathname + url.search;
        }

        return reply.render('/root/index.hbs', {
            messages: messages.map(entry => {
                entry.unseen = !entry.flags || !entry.flags.includes('\\Seen');
                return entry;
            }),
            page,
            nextPageUrl,
            prevPageUrl
        });
    },
    schema: {
        // request needs to have a querystring with a `name` parameter
        querystring: {
            type: 'object',
            properties: {
                page: { type: 'number' }
            },
            required: []
        }
    }
});

// route for the message
fastify.route({
    method: 'GET',
    url: '/account/:account/message/:message',
    handler: async (req, reply) => {
        return reply.render('/root/message.hbs', {
            message: await ee.getMessage(req.params.account, req.params.message)
        });
    },
    schema: {
        // request needs to have a querystring with a `name` parameter
        params: {
            type: 'object',
            properties: {
                account: { type: 'string' },
                message: { type: 'string' }
            },
            required: ['account', 'message']
        }
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: WEB_PORT });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
