import './App.css';
import ReportModel, {ReportStatistics} from './reportModel';
import {ScenarioOverview} from "./components/ScenarioOverview/ScenarioOverview";
import { Scenario } from './components/Scenario/Scenario';
import * as guaranteedStateScenario from "./sampleData/GuaranteedStateTestScenario.json"

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
            <Scenario scenario={guaranteedStateReport.scenarios[0]}/>
            {/*<CasesTable cases={cases} */}
        </div>
    );
}

export default App;
