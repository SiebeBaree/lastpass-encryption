export default class ServerMock {
    loginHash = null;
    secrets = new Map();

    async login(value) {
        this.loginHash = value;
    }

    async authenticate(value) {
        return value === this.loginHash;
    }

    async getSecret(key, loginHash) {
        if (loginHash !== this.loginHash) {
            throw new Error("Invalid login hash");
        }

        return this.secrets.get(key);
    }

    async setSecret(key, value, loginHash) {
        if (loginHash !== this.loginHash) {
            throw new Error("Invalid login hash");
        }

        this.secrets.set(key, value);

        console.log("Secrets:");
        this.secrets.forEach((value, key) => {
            console.log(key, value);
        });
        console.log();
    }
}
