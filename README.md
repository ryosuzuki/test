# Reality ChatGPT - Summarization

## Install
```
npm install
```

```
node server.js
```

```
npm run start
```

Add `config.json` for ChatGPT API 
```
{
  "apiKey": "xxx"
}
```

Self-signed SSL cerificates
```
npm install -g mkcert
```

```
mkcert [your-ip-address-here] ::4000
```

Update files 
- **server.js**

   - ```const key = fs.readFileSync('./ip-key.pem');```

   - ```const cert = fs.readFileSync('./ip.pem');```

- **App.js**

   - ``` this.socket = io('https://IP:PORT') ```

   - ``` let target = `imageTargetSrc: https://IP:PORT/public/targets/${this.state.currentTestingDoc}.mind` ```


## Markers

- [Mind AR.js Image Target Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile)
- [Dynamically create markers](https://github.com/hiukim/mind-ar-js-doc/blob/a32d638b74935e2b0df9763794926c88b1d75d8c/static/samples/compile.html)


## Debug
- When getting the node-canvas error for M1 Mac ``` brew install pkg-config cairo pango libpng jpeg giflib librsvg ```

