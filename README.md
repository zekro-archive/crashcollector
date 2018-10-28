 <div align="center">
     <h1>~ crashCollector ~</h1>
     <strong>Small module for better crash logs and crash log saves</strong><br><br>
     <a href="https://www.npmjs.com/package/crashcollector" ><img src= "https://img.shields.io/npm/v/crashcollector.svg" /></a>&nbsp;
     <a href="https://www.npmjs.com/package/crashcollector" ><img src="https://img.shields.io/npm/dt/crashcollector.svg" /></a>

 </div>

---

```
npm install crashcollector --save
```

---

# Usage

Just pull out the **`CrashCollector`** class out of the requirement and create a new instance of it in one of your files like following:

```js
// Inclunding class CrashCollector from module
const { CrashCollector } = require('../src/index')

// Creating CrashCollector instance
// Set save path to 'crash_logs' and pass function for stuff
// to do between exception occured and program will exit
new CrashCollector('crash_logs', (err, exit) => {
    console.log('Cleaning up...')
    console.log('Saving some stuff...')
    // Calls callback funtion executing process.exit()
    // You can also just write process.exit() here
    exit()
})
```

------

# Docs

### CrashCollector

> Crash collector class constructor

| Parameter | Type | Optional (Default) | Description |
|-----------|------|--------------------|-------------|
| location | string | yes `(default 'null')` | Path where crash logs will be saved. 'null' to disable saving log files. | If path does not exists, the script will create path. |
| functionAfterCrash | function | yes `(default 'null')` | Function with expressions which will be executed between exception was catched and program will exit. This function passes as first argument the `error` and as second argument the `exit` callback function, which should be executed after all tasks are finished to close the program. Alternatively, you can also use `process.exit()` at this point instead of executing the callback. |
| options.disableWarning | boolean | yes `(default 'false')` | Disable warn message when using 'functionAfterCrash' |

---

© 2018 - present Ringo Hoffmann (zekro Development)
