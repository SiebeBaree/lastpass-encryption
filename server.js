export default class ServerMock {
    secrets = new Map();

    async getSecret(key) {
        return this.secrets.get(key);
    }

    async setSecret(key, value) {
        this.secrets.set(key, value);

        console.log("Secrets:");
        this.secrets.forEach((value, key) => {
            console.log(key, value);
        });
        console.log();
    }
}
