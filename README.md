# Lastpass Encryption

This is a implementation of the Lastpass encryption algorithm in JavaScript. It's a simple script that's not meant to be used in production but rather to understand how Lastpass encrypts your data. This script is based on the information provided by Lastpass in their [whitepaper](https://www.lastpass.com/nl/resources/tools/lastpass-security-principles-technical-whitepaper).

## Todo [If I ever get to it :)]

-   [ ] Seperate client and server (using server.js)
-   [ ] Clean up code (extract functions)
-   [x] Create password schema to also strengthen the weakest link (a.k.a. the password)

## How to use

Simple, just run:

```bash
pnpm run start
```

## Why did I make this?

I wanted to understand how Lastpass encrypts your data and how it's stored. I need the same level of security for a project I'm working on and I wanted to understand how it works.

You can visit the project here: [https://enkryptify.com](https://enkryptify.com)
