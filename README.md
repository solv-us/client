# solv.us client
This repository contains the client-facing/stage component of solv.us. For more information about this project, please see the [server repository](https://github.com/solv-us/server).

## How to use
A standalone build of the client is exposed automatically by the server at ```/solvus-client.js```, so you can add it to your project like this:

```html
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
```js
// This requires support for ES6 import syntax
import SolvusClient from '@solvus/client'
let client = new SolvusClient();
```

Settings
```js
    let client = new SolvusClient({
        stageId: 'main',
        serverURI: 'https://localhost:8843',
        injectStandbyScreen:true,
        standbyVisible:true,
        bodyClickTogglesFullScreen:true
    };
```
When not hardcoded, the stageId and serverURI values can be set with URL parameters:
```/?stageId=SecondStage&serverURI=https://localhost:8469```

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
