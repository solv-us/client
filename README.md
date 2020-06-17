# solv.us client
This repository contains the client-facing/stage component of solv.us. For full instructions, please see the [documentation repository](https://github.com/solv-us/documentation).


## Setup for use in projects

### Prerequisites
Solv.us server runs in a Node.js environment, so make sure [Node.js](https://nodejs.org/en/) is installed on the computer you intend to run this server on. 

Download the latest version from the Releases tab, and include it in your project like this:
```
<script src="../dist/solvus-client.js"></script>
```

or, if you use NPM, like this:
```
import * as webpackNumbers from 'webpack-numbers';
```

### Note on HTTPS
Solv.us server is by default only accessible over HTTPS. To make things easier, it will generate the necessary certificate and key on start up and save them in the root folder. Browsers will not trust this certificate since it's self-signed, so in each browser you will need to trust it manually.

If you wish to provide your own certificate and key to prevent this, save them as ```./local-cert.pem``` and ```./local-key.pem``` in your root folder.





## Setup for development of the plugin
If you want to add features or customize the client, you'll need to clone the whole repository and install its dependencies:

```
git clone https://github.com/solv-us/stage.git
cd stage
npm install
```

### Build the library
```
npm run build
```


## Directories

| Directory         | Purpose                                                              |
|-------------------|----------------------------------------------------------------------|
| /dist             | Containtes minified and bundled script to use in your project        |
| /src              | The source code of the plugin                                        |