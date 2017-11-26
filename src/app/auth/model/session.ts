export class Session {
    constructor(
        private token: string,
        private data: string
    ) {}

    getToken(): string {
        return this.token;
    }

    setToken(token) {
        this.token = token;
    }

    getData(): string {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }
}
