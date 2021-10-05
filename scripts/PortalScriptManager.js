const fs = require('fs');
module.exports = class PortalScriptManager {
    constructor() {
        this.portal = null;
    }
    executePortalScript(client, portal) {
        const portalScript = this.getPortalScript(portal.name);
        const pi = null;
        if(portalScript !== null){
            eval(`${portalScript} 
            enter(${pi});`);
        }
    }

    getPortalScript(scriptName){
        if (!fs.existsSync(`${__dirname}/portal/${scriptName}.js`)) {
            console.log(`This portal script "${scriptName}" is currectly not coded.`);
            return null;
        }
        return fs.readFileSync(`${__dirname}/portal/${scriptName}.js`);
    }

    
}