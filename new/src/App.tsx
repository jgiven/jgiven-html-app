import './App.css';
import ReportModel, {ReportStatistics} from './reportModel';
import {ScenarioOverview} from "./components/ScenarioOverview/ScenarioOverview";
import * as guaranteedStateScenario from "./sampleData/GuaranteedStateTestScenario.json"
import {ScenarioClass} from "./components/Scenarios/ScenarioClass";

const statistics: ReportStatistics[] = [
    {
        numClasses: 3,
        numScenarios: 5,
        numFailedScenarios: 2,
        numCases: 3,
        numFailedCases: 3,
        numSteps: 10,
        durationInNanos: 12345678910,
        numPendingScenarios: 0,
        numSuccessfulScenarios: 3
    }
]

const guaranteedStateReport: ReportModel = guaranteedStateScenario as unknown as ReportModel;

function App() {
    return (
        <div className="App">
            <ScenarioOverview statistic={statistics[0]}/>
            <ScenarioClass scenarios={guaranteedStateReport.scenarios}/>
        </div>
    );
}

export default App;
