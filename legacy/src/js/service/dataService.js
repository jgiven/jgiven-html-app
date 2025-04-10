/**
 * Provides functions to access the generated scenario data
 */
import { sortByDescription } from '../util.js'

export default function DataService () {
  'use strict';

  var tagFile = jgivenReport.tagFile;
  var testCases = jgivenReport.scenarios;

  function getAllScenarios () {
    return _.flatten(_.map(testCases, function (testClass) {
      return _.map(testClass.scenarios, function (scenario) {
        scenario.classTitle = testClass.name;
        return scenario;
      });
    }), true);
  }

  function getScenariosWhere (filter) {
    return sortByDescription(_.filter(getAllScenarios(), filter));
  }

  function getPendingScenarios () {
    return getScenariosWhere(function (x) {
      return x.executionStatus !== "SUCCESS" && x.executionStatus !== "FAILED" && x.executionStatus !== "ABORTED";
    });
  }

  function getFailedScenarios () {
    return getScenariosWhere(function (x) {
      return x.executionStatus === "FAILED";
    });
  }

  function getAbortedScenarios () {
    return getScenariosWhere(function (x) {
      return x.executionStatus === "ABORTED";
    });
  }

  return {

    getTagFile: function () {
      return tagFile;
    },

    getTestCases: function () {
      return testCases;
    },

    getMetaData: function () {
      return jgivenReport.metaData;
    },

    getCustomNavigationLinks: function () {
      return jgivenReport.customNavigationLinks;
    },

    getAllScenarios: getAllScenarios,
    getPendingScenarios: getPendingScenarios,
    getFailedScenarios: getFailedScenarios,
    getAbortedScenarios: getAbortedScenarios

  };
}
