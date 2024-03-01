import "./App.css";
import ReportModel, {ReportStatistics} from "./reportModel";
import * as guaranteedStateScenario from "./sampleData/GuaranteedStateTestScenario.json";
import {ScenarioOverview} from "./components/Scenarios/ScenarioOverview";
import {useParams} from "react-router-dom";

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
    let { result } = useParams();
    return (
        <div className="App" aria-label="App">
            {result}
            <ScenarioOverview
                title={"Mein Titel"}
                description={"Meine Description"}
                reportName={guaranteedStateReport.name}
                scenarios={guaranteedStateReport.scenarios}
            />
        </div>
    );
}

export default App;
