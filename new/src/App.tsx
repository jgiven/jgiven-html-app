import './App.css';
//import {CasesTable} from "./components/casesTable/CasesTable";
import type ReportModel from './reportModel';
import type {ScenarioCaseModel} from './reportModel';
import guaranteedStateScenario from './sampleData/GuaranteedStateTestScenario.json'
import {Scenario} from "./components/Scenario/Scenario";

const cases: ScenarioCaseModel[] = [
    {
        caseNr: 0,
        derivedArguments: [],
        description: "A sample Case",
        durationInNanos: 12345556,
        explicitArguments:[],
        status: "SUCCESS",
        steps:[],
    }
]

const guaranteedStateReport: ReportModel = guaranteedStateScenario as unknown as ReportModel;

function App() {
    let a = cases;
    a = a;
    return (
        <div className="App">
            <Scenario scenario={guaranteedStateReport.scenarios[0]}/>
            {/*<CasesTable cases={cases} */}
        </div>
    );
}

export default App;
