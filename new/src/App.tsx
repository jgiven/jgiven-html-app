import "./App.css";
import ReportModel from "./reportModel";
import * as guaranteedStateScenario from "./sampleData/GuaranteedStateTestScenario.json";
import { ScenarioOverview } from "./components/Scenarios/ScenarioOverview";

const guaranteedStateReport: ReportModel = guaranteedStateScenario as unknown as ReportModel;

function App() {
    return (
        <div className="App" aria-label="App">
            <ScenarioOverview
                title={"Mein Titel"}
                description={"Meine Description"}
                reportName={guaranteedStateReport.name}
            />
        </div>
    );
}

export default App;
