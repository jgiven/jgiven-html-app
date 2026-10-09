"use strict";

/**
 * Minimal jgivenReport global for golden-test fixtures in new/build/.
 * Mirrors legacy/src/js/api.js loading behavior (without pako).
 */
window.jgivenReport = {
    scenarios: [],
    customNavigationLinks: [],

    setTags: function setTags(tagFile) {
        this.tagFile = tagFile;
    },

    setMetaData: function setMetaData(metaData) {
        this.metaData = metaData;
        for (var i = 0; i < metaData.data.length; i++) {
            document.write("<script src='data/" + metaData.data[i] + "'></script>");
        }
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

    addCustomNavigationLink: function addCustomNavigationLink(link) {
        this.addNavigationLink(link);
    },

    setTitle: function setTitle(title) {
        this.metaData.title = title;
    }
};
