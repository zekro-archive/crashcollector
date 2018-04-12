const fs = require('fs')

// Console Colors Statics
const CLR = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
}

// Function to get current time and pars it for log and file names
function getTime(forFile) {
    function btf(inp) {
    	if (inp < 10)
	    return "0" + inp;
    	return inp;
    }
    var date = new Date(),
        y = date.getFullYear(),
        m = btf(date.getMonth() + 1),
	    d = btf(date.getDate()),
	    h = btf(date.getHours()),
	    min = btf(date.getMinutes()),
	    s = btf(date.getSeconds());
    return forFile ? `${y}-${m}-${d}_${h}-${min}-${s}` : `${m}/${d}/${y} - ${h}:${min}:${s}`;
}


class CrashCollector {
    /**
     * CrashCollector class constructor
     * 
     * @param {string}   [location]               Location where error save files will be stored (relative or absolute path)
     *                                            'null' to disable log saving.
     * @param {function} [functionAfterCrash]     Function, which will be executed after unexpectedError 
     *                                            occured. PLEASE EXIT THE SCRIPT AFTER WITH process.exit() 
     *                                            AND DON'T USE THIS FUNCTION TO CHATCH ERRORS! 
     *                                            READ MORE HERE: https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
     * @param {boolean}  [options.disableWarning] Disable warning message on using 'functionAfterCrash'
     */
    constructor(location, functionAfterCrash, options) {

        this.options = options

        this.location = location
        if (this.location && !fs.existsSync(this.location))
            fs.mkdirSync(this.location)

        this.exec = functionAfterCrash
        process.on('uncaughtException', (err) => {

            var save_file
            
            if (this.location) {
                save_file = `${this.location}/${getTime(true)}_crash.log`
                fs.writeFileSync(save_file, 
                    `TIME:      ${getTime()}\n` + 
                    `TYPE:      ${err.name}\n` + 
                    `MESSAGE:   ${err.message}\n\n\n` + 
                    `STACK TRACE:\n\n${err.stack}\n`
                )
            }

            const BAR = CLR.FgRed + '|' + CLR.Reset
            console.error(`\n${CLR.FgRed}---------------------------------------- - - - - - -${CLR.Reset}\n` +
                `${BAR} ${CLR.BgRed}< AN UNEXPECTED ERROR OCCURED >${CLR.Reset}\n` +
                `${BAR} TIME:    ${getTime()}\n` +
                `${BAR} TYPE:    ${CLR.FgCyan + err.name + CLR.Reset}\n` +
                `${BAR} MESSAGE: ${CLR.FgCyan + err.message + CLR.Reset}\n${BAR}\n` +
                `${BAR} STACK STRACE:\n` +
                err.stack.split('\n').map(l => `${BAR} ${l}`).join('\n') +
                (this.location ? `\n${BAR}\n${BAR} SAVE: ${save_file}\n` : '')
            )

            if (!functionAfterCrash)
                process.exit(-1)
            else {
                if (!this.options || !this.options.disableWarning)
                    console.log(
                        `\n${CLR.FgYellow}<--------------------------------------- ${CLR.FgWhite + CLR.BgRed}` + 
                        `[ ATTENTION ]${CLR.Reset + CLR.FgYellow}--------------------------------------->${CLR.FgWhite}\n` + 
                        `                     Only use halder functions in unexpectedErrorEvent as                      \n` + 
                        ` clean-up-functions and not to continue the program after an error! Read more about that here: \n` +
                        `     https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly     \n` +
                        `${CLR.FgYellow}<--------------------------------------------------------------------------------------------->\n${CLR.Reset}`
                    )

                functionAfterCrash(err, () => {
                    console.log(`\n${CLR.BgRed}EXITED WITH CODE -1${CLR.Reset}\n`)
                    process.exit(-1)
                })
            }
        })
    }
}


module.exports = { CrashCollector }