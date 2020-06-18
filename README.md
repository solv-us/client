# solv.us client
This repository contains the client-facing/stage component of solv.us. For more information about this project, please see the [server repository](https://github.com/solv-us/server).

## How to use
A standalone build of the client is exposed automatically by the server at ```/solvus-client.js```, so you can add it to your project like this:

```
<script src="./solvus-client.js"></script>
<script>
        let client = new SolvusClient();
        
        client.on('stageEvent', (event)=>{
           // React to stage events here
        });
        
        client.on('beat', (time)=>{
            // Do something here every beat
        });
</script>
        
```

or, if you prefer to use npm, add it to your project the following way:

```
npm install @solvus/client
```
```
// This requires support for ES6 import syntax
import SolvusClient from '@solvus/client'
let client = new SolvusClient();
```

The set-up takes two optional arguments: ```stageId``` and ```serverURI```. When not supplied, these values can be set with URL parameters:
```/?stageId=SecondStage&serverURI=https://localhost:8469```

If these values are also not provided in the URL, ```stageId``` defaults to ```main```, and ```serverURI``` defaults to the  [host](https://developer.mozilla.org/en-US/docs/Web/API/Location/host) of the page.


## Setup for development
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
