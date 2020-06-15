class SpamBlockersError extends Error {
    constructor(response, message) {
        super(message);
        this.status = response.status;
    }
}

class UnauthorizedError extends SpamBlockersError {}

class ForbiddenError extends SpamBlockersError {}

class TooManyRequestsError extends SpamBlockersError {
    constructor(response) {
        const method = new URL(response.config.url).pathname.slice(1);
        const until = new Date((response.data.until || 0) * 1000);

        super(response, `You're being rate-limited from using the method '${method}'`);
        this.method = method;
        this.until = until;
    }
}

module.exports = {
    SpamBlockersError,
    UnauthorizedError,
    ForbiddenError,
    TooManyRequestsError,
};
