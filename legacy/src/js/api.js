'use strict';

var pako = require('pako')

/**
 * Global variable that is used by the generated JSONP files.
 * This variable can also be used by the custom Javascript file.
 */
window.jgivenReport = {
    scenarios: [],
    customNavigationLinks: [],

    setTags: function setTags(tagFile) {
        this.tagFile = tagFile;
    },

    setMetaData: function setMetaData(metaData) {
        this.metaData = metaData;
        _.forEach(metaData.data, function (x) {
            document.writeln("<script src='data/" + x + "'></script>");
        });
    },

    addZippedScenarios: function addZippedScenarios(zip) {
        var string = pako.inflate(this.base64ToUint8Array(zip), {to: 'string'})
        var unzipped = JSON.parse(string);
        this.addScenarios(unzipped.scenarios);
    },

    base64ToUint8Array(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    },

    addScenarios: function addScenarios(scenarios) {
        this.scenarios = this.scenarios.concat(scenarios);
    },

    setAllScenarios: function setAllScenarios(allScenarios) {
        this.scenarios = allScenarios;
    },

    addNavigationLink: function addNavigationLink(link) {
        this.customNavigationLinks.push(link);
    },

    setTitle: function setTitle(title) {
        this.metaData.title = title;
    }
};
