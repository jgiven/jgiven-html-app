import { nanosToReadableUnit } from "../../util/format";
import { useApp } from "../../context/AppProvider";
import { ScenarioView } from "./ScenarioView";

export function ScenarioList() {
    const { currentPage, bumpRender } = useApp();

    if (currentPage.summary) return null;

    return (
        <div>
            {currentPage.groupedScenarios.map(group => (
                <div key={group.name} className="scenario-group-row">
                    {group.name !== "all" && (
                        <div className="row">
                            <div className="small-12 column no-pad-left">
                                <h3
                                    className="scenario-group-header toggle"
                                    onClick={() => {
                                        group.expanded = !group.expanded;
                                        bumpRender();
                                    }}
                                >
                                    <span
                                        className={`scenario-group-header-name ${group.counts.failed > 0 ? "failed" : ""}`}
                                    >
                                        {group.name}
                                        <span className="secondary radius label group-count total">
                                            {group.values.length}
                                        </span>
                                        {group.counts.failed > 0 && (
                                            <span className="radius label group-count alert failed">
                                                <i className="fa fa-exclamation-circle" />{" "}
                                                {group.counts.failed} FAILED
                                            </span>
                                        )}
                                        {(group.counts.aborted ?? 0) > 0 && (
                                            <span className="radius label group-count alert aborted">
                                                <i className="fa fa-exclamation-circle" />{" "}
                                                {group.counts.aborted} ABORTED
                                            </span>
                                        )}
                                        {group.counts.pending > 0 && (
                                            <span className="secondary radius label group-count pending">
                                                <i className="fa fa-ban" /> {group.counts.pending}{" "}
                                                PENDING
                                            </span>
                                        )}
                                        <span className="duration">
                                            {" "}
                                            ({nanosToReadableUnit(group.counts.durationInNanos)})
                                        </span>
                                    </span>
                                </h3>
                            </div>
                        </div>
                    )}
                    {(group.expanded || group.name === "all") &&
                        group.values.map((scenario, idx) => (
                            <ScenarioView
                                key={`${scenario.className}-${scenario.testMethodName}`}
                                scenario={scenario}
                                groupName={group.name}
                                pageTitle={currentPage.title}
                                isLast={idx === group.values.length - 1}
                            />
                        ))}
                </div>
            ))}
        </div>
    );
}
