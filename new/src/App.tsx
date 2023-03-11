import './App.css';
import type ReportModel from './reportModel';
import guaranteedStateScenario from './sampleData/GuaranteedStateTestScenario.json'
import {Scenario} from "./components/Scenario/Scenario";

const guaranteedStateReport: ReportModel = guaranteedStateScenario as unknown as ReportModel;

function App() {
    return (
        <div className="App">
            <Scenario scenario={guaranteedStateReport.scenarios[0]}/>
            {/*<CasesTable cases={cases} */}
        </div>
    );
}

export default App;
