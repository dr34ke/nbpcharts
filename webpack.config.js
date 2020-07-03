const {resolve} = require("path");
module.exports={
    entry: "./src/javascript/app.js",
    output:{ 
        filename: "bundle.js",
        path: resolve(__dirname, "./dist")
    }
}