import "./App.css";
import ReportModel, { ReportStatistics } from "./reportModel";
import * as guaranteedStateScenario from "./sampleData/GuaranteedStateTestScenario.json";
import { SingleScenarioView } from "./components/Scenarios/SingleScenarioView";

export const statistics: ReportStatistics[] = [
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
];

const guaranteedStateReport: ReportModel = guaranteedStateScenario as unknown as ReportModel;

function App() {
    return (
        <div className="App" aria-label="App">
            <SingleScenarioView
                reportName={guaranteedStateReport.name}
                scenario={guaranteedStateReport.scenarios[0]}
            />
        </div>
    );
}

export default App;
