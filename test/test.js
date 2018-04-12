// Inclunding class CrashCollector from module
const { CrashCollector } = require('../src/index')

// Creating CrashCollector instance
// Set save path as default 
new CrashCollector('crash_logs', (err, exit) => {
    console.log('Cleaning up...')
    console.log('Saving some stuff...')
    // Calls callback funtion executing process.exit()
    // You can also just write process.exit() here
    exit()
})

// This is just for provoke an unhandled exception
a = {}
console.log(a.b.c)