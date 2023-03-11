import './App.css';
//import {CasesTable} from "./components/casesTable/CasesTable";
import type {ScenarioCaseModel} from './reportModel';
import guaranteedStatScenario from './sampleData/GuaranteedStateTestScenario.json'
import {ScenarioCase} from "./components/ScenarioCase";

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

function App() {
    let a = cases;
    a = a;
    return (
        <div className="App">
            <ScenarioCase scenarioCase={guaranteedStatScenario.scenarios[0].scenarioCases[0]}/>
            {/*<CasesTable cases={cases} */}
        </div>
    );
}

export default App;
