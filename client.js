const axios = require('axios');
const { Ban, Token } = require('./types');
const { UnauthorizedError, ForbiddenError, TooManyRequestsError } = require('./errors');

class Client {
    /**
     * Client to interface with the SpamBlockers API.
     * @param {String} token The Authorization Token
     * @param {String} [host='https://spamblockers.lungers.com/api/v1'] The API host. Defaults to the official API.
     */
    constructor(token, host = 'https://spamblockers.lungers.com/api/v1') {
        this._host = host;
        this._instance = axios.create({
            validateStatus(status) {
                return status < 500;
            }
        });
        // We're now going back to what SpamWatch JS Wrapper is using.
        this._instance.defaults.headers.common.Authorization = `Bearer ${token}`;
        this._token = token;
    }

    /**
     * Make a request and handle errors
     * @param {String} path Path on the API without a leading slash
     * @param {String} [method='get'] The request method. Defaults to GET
     * @param {Object} [kwargs] Keyword arguments passed to the request method.
     * @returns {Promise<axios.AxiosResponse>} The json response and the request object
     * @throws {UnauthorizedError} Make sure your token is correct
     * @throws {ForbiddenError}
     */
    async _makeRequest(path, method = 'get', kwargs) {
        const response = await this._instance.request({
            method: method,
            url: `${this._host}/${path}`,
            ...kwargs,
        });

        switch (response.status) {
            default:
                return response;

            case 401:
                throw new UnauthorizedError(response, 'Is your token valid? If yes, make sure you correctly entered your API key.');

            case 403:
                throw new ForbiddenError(response, this._token);

            case 429:
                throw new TooManyRequestsError(response);
        }
    }

    /**
     * Get the API version
     * @returns {Object}
     */
    async version() {
        const { data } = await this._makeRequest('version');
        return data;
    }

    /**
     * Get all tokens
     * Requires Root permission
     * @returns {Token[]}
     */
    async getTAllApiTokens() {
        const { data } = await this._makeRequest('users');
        return data.map(token => new Token(token.id, token.permission, token.token, token.userid));
    }

    /**
     * Creates a token with the given parameters
     * Requires Admin permission
     * @param {Number} userid The Telegram User ID of the token owner
     * @param { 'Admin' | 'User'} permission The permission level the Token should have
     * @returns {Token|null} The created tokern
     */
    async generateApiToken(userid, permission) {
        const { status, data } = await this._makeRequest('users', 'post', {
            data: {
                id: userid,
                permission,
            },
        });

        if (status === 400) {
            return null;
        }

        return new Token(data.id, data.permission, data.token, data.userid);
    }

    /**
     * Gets the Token that the request was made with.
     * @returns {Token}
     */
    async pullSelfMeta() {
        const { data } = await this._makeRequest('tokens/self');
        return new Token(data.id, data.permission, data.token, data.userid);
    }

    /**
     * Get a token using its ID
     * Requires Root permission
     * @param {Number} tokenid The token ID
     * @returns {Token} The token
     */
    async getApiTokenMetadata(tokenid) {
        const { data } = await this._makeRequest(`tokens/${tokenid}`);
        console.log(data);
        return new Token(data.id, data.permission, data.token, data.userid);
    }

    /**
     * Delete the token using its ID
     * @param tokenid The ID of the token
     */
    async revokeApiToken(tokenid) {
        await this._makeRequest(`tokens/${tokenid}`, 'delete');
    }

    /**
     * Query a user's ban reason.
     * @param {Number} userid ID of the user
     * @returns {Ban|Boolean} Ban object or null
     */
    async queryBanStatus(userid) {
        const { status, data } = await this._makeRequest(`bans/${userid}`);

        if (status === 404) {
            return false;
        }

        return new Ban(data.id, data.reason, data.admin, data.date, data.message);
    }

    /**
     * Get a list of all bans
     * Requires Root user rights.
     * @returns {Ban[]} A list of bans
     */
    async exportAllBans() {
        const { data } = await this._makeRequest('bans');
        return data.map(ban => new Ban(ban.id, ban.reason, ban.admin, ban.date, ban.message));
    }

    /**
     * Unban a user.
     */
    async removeGban(userid) {
        await this._makeRequest(`banlist/${userid}`, 'delete');
    }

    /**
     * Bans a user to the blacklist.
     * If banned but a different reason was given, it should also update it on DB side.
     * @param {Number} userid ID of the banned user
     * @param {String} reason Reason why the user was banned
     */
    async addNewGban(userid, reason) {
        await this._makeRequest('banlist', 'post', {
            data: [
                {
                    id: userid,
                    reason,
                    message,
                },
            ],
        });
    }

    /**
     * Pull only banned user IDs from the API.
     * @returns {Number[]}
     */
    async pullBannedUserids() {
        const { data } = await this._makeRequest('banlist/all');

        if (!data) {
            return [];
        }

        return data.split('\n').map(uid => Number(uid));
    }

    /**
     * Batch ban some users.
     * @param {Ban[]} data List of Ban objects
     */
    async batchGban(data) {
        await this._makeRequest('banlist', 'post', {
            data: data.map(d => ({
                id: d.id,
                reason: d.reason,
            })),
        });
    }

    async stats() {
        const { data } = await this._makeRequest('stats');
        return data;
    }
}

module.exports = {
    Client,
};
