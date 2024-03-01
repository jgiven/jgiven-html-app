import "./App.css";
import ReportModel from "./reportModel";
import * as guaranteedStateScenario from "./sampleData/GuaranteedStateTestScenario.json";
import {ScenarioOverview} from "./components/Scenarios/ScenarioOverview";
import {useSearchParams} from "react-router-dom";

const guaranteedStateReport: ReportModel = guaranteedStateScenario as unknown as ReportModel;

function App() {
    const [searchParams] = useSearchParams();
    return (
        <div className="App" aria-label="App">
            {searchParams.get("result")}
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
