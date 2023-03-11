import logo from './logo.svg';
import './App.css';
//import {CasesTable} from "./components/casesTable/CasesTable";
import type {ScenarioCaseModel} from './reportModel';
import guaranteedStatScenario from '../sampleData/GuaranteedStateTestScenario.json'
import {ScenarioCase} from "./components/Scenario";

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
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <ScenarioCase scenarioCase={guaranteedStatScenario.scenarios[0].scenarioCases[0]}/>
            {/*<CasesTable cases={cases} */}
        </div>
    );
}

export default App;
