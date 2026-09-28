import { useState } from "react";
import type {
    ScenarioCase,
    ScenarioStep,
    Scenario as ScenarioModel
} from "../../types/jgivenReport";
import { capitalize, getThumbnailPath, isImageType, nanosToReadableUnit } from "../../util/format";
import { getNonIntroWords } from "../../services/searchService";
import { getMetaData } from "../../services/dataService";
import {
    getCssClassOfTag,
    getStyleOfTag,
    getTagByTagId,
    getUrlFromTag,
    tagIdToString
} from "../../services/tagService";
import {
    getNumberOfAbortedCases,
    getNumberOfFailedCases,
    getScenarioCaseTitleStatusClass,
    getScenarioTitleStatusClass
} from "../../services/statistics";
import { HashNavLink, hashToPath } from "../../routing/hashNav";
import { useApp } from "../../context/AppProvider";
import { CasesTable } from "./CasesTable";

function StepRow({
    step,
    scenario,
    scenarioCase,
    nested
}: {
    step: ScenarioStep;
    scenario: ScenarioModel;
    scenarioCase: ScenarioCase;
    nested?: boolean;
}) {
    const { bumpRender } = useApp();
    const [tipVisible, setTipVisible] = useState(false);
    const hasTip = !!(step.extendedDescription || step.comment);
    const tipText = [step.extendedDescription, step.comment].filter(Boolean).join("\n");

    const content = (
        <>
            {(nested ? step.words : getNonIntroWords(step.words)).map((word, wi) => (
                <span
                    key={wi}
                    className={`word ${scenario.executionStatus !== "SUCCESS" ? step.status : ""} ${word.isDifferent ? "diff" : ""}`}
                >
                    {scenario.casesAsTable && word.argumentInfo?.parameterName && (
                        <strong>&lt;{word.argumentInfo.parameterName}&gt;</strong>
                    )}
                    {!(scenario.casesAsTable && word.argumentInfo?.parameterName) &&
                        !word.argumentInfo?.dataTable && (
                            <span
                                className={`${word.argumentInfo ? "argument" : ""} ${(word.argumentInfo?.formattedValue ?? word.value).includes("\n") ? "multiline" : ""}`}
                            >
                                {word.argumentInfo?.formattedValue ?? word.value}
                            </span>
                        )}
                    {word.argumentInfo?.dataTable && (
                        <table className="table-value">
                            <tbody>
                                {word.argumentInfo.dataTable.data.map((row, ri) => (
                                    <tr key={ri}>
                                        {row.map((cell, ci) => (
                                            <td
                                                key={ci}
                                                className={
                                                    (ri === 0 &&
                                                        (word.argumentInfo!.dataTable!
                                                            .headerType === "HORIZONTAL" ||
                                                            word.argumentInfo!.dataTable!
                                                                .headerType === "BOTH")) ||
                                                    (ci === 0 &&
                                                        (word.argumentInfo!.dataTable!
                                                            .headerType === "VERTICAL" ||
                                                            word.argumentInfo!.dataTable!
                                                                .headerType === "BOTH"))
                                                        ? "header-cell"
                                                        : ""
                                                }
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </span>
            ))}
            {step.attachments?.map((attachment, ai) =>
                attachment.showDirectly ? (
                    <div key={ai}>
                        <img
                            className="direct-image"
                            src={`data/${attachment.value}`}
                            alt={attachment.title}
                        />
                    </div>
                ) : null
            )}
            {scenario.executionStatus !== "SUCCESS" && (
                <>
                    {step.status === "PASSED" && <i className="small-check fa fa-check-square" />}
                    {step.status === "FAILED" && (
                        <i className="failed-icon fa fa-exclamation-circle" />
                    )}
                    {(step.status === "SKIPPED" || step.status === "PENDING") && (
                        <i className="skipped fa fa-ban" />
                    )}
                    {step.status === "ABORTED" && <i className="aborted fa fa-fa-ban" />}
                </>
            )}
            {(step.durationInNanos ?? 0) > 10000000 && (
                <span className="duration"> ({nanosToReadableUnit(step.durationInNanos!)})</span>
            )}
        </>
    );

    const row = (
        <tr
            className={`steps ${step.nestedSteps ? "toggle" : ""}`}
            onClick={() => {
                if (step.nestedSteps) {
                    step.expanded = !step.expanded;
                    bumpRender();
                }
            }}
        >
            <td
                className={`steps ${step.isSectionTitle ? "section-title" : "intro-word"} ${scenario.executionStatus !== "SUCCESS" ? step.status : ""}`}
                colSpan={step.isSectionTitle ? 2 : 1}
            >
                {step.nestedSteps && (
                    <i
                        className={`fa ${step.expanded ? "fa-angle-down" : "fa-angle-right"} step-expand-icon`}
                    />
                )}
                {(step.words[0]?.isIntroWord || step.isSectionTitle) &&
                    capitalize(step.words[0]?.value ?? "")}
            </td>
            {!step.isSectionTitle && (
                <td className="steps">
                    <span
                        aria-haspopup={hasTip ? "true" : "false"}
                        className={hasTip ? "has-tip" : ""}
                        onMouseEnter={() => setTipVisible(true)}
                        onMouseLeave={() => setTipVisible(false)}
                    >
                        {content}
                        {tipVisible && hasTip && <span className="tooltip">{tipText}</span>}
                    </span>
                    {scenario.scenarioCases.map(sc => {
                        const caseStep = sc.steps[scenarioCase.steps.indexOf(step)];
                        if (!caseStep?.attachments) return null;
                        return caseStep.attachments.map((attachment, ai) => {
                            if (
                                attachment.showDirectly ||
                                (!scenario.casesAsTable && sc.caseNr !== scenarioCase.caseNr)
                            )
                                return null;
                            const meta = getMetaData();
                            return (
                                <span key={`${sc.caseNr}-${ai}`}>
                                    <a
                                        target="_blank"
                                        href={`data/${attachment.value}`}
                                        rel="noreferrer"
                                    >
                                        {isImageType(attachment.mimeType ?? attachment.mediaType) &&
                                        meta.showThumbnails ? (
                                            <img
                                                className="jgiven-html-thumbnail"
                                                src={`data/${getThumbnailPath(attachment.value)}`}
                                                alt={attachment.title}
                                            />
                                        ) : (
                                            <i className="fa fa-paperclip" />
                                        )}
                                    </a>
                                </span>
                            );
                        });
                    })}
                </td>
            )}
        </tr>
    );

    if (nested) {
        return (
            <div
                className="nested-step toggle"
                onClick={e => {
                    step.expanded = !step.expanded;
                    bumpRender();
                    e.stopPropagation();
                }}
            >
                {row}
                {step.nestedSteps && step.expanded && (
                    <div>
                        {step.nestedSteps.map((ns, i) => (
                            <StepRow
                                key={i}
                                step={ns}
                                scenario={scenario}
                                scenarioCase={scenarioCase}
                                nested
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            {row}
            {step.nestedSteps && step.expanded && (
                <tr>
                    <td colSpan={2}>
                        {step.nestedSteps.map((ns, i) => (
                            <StepRow
                                key={i}
                                step={ns}
                                scenario={scenario}
                                scenarioCase={scenarioCase}
                                nested
                            />
                        ))}
                    </td>
                </tr>
            )}
        </>
    );
}

export function ScenarioView({
    scenario,
    groupName,
    pageTitle,
    isLast
}: {
    scenario: ScenarioModel;
    groupName: string;
    pageTitle: string;
    isLast?: boolean;
}) {
    const { toggleScenario, bumpRender } = useApp();
    const displayCases = scenario.casesAsTable
        ? [scenario.scenarioCases[0]]
        : scenario.scenarioCases;

    return (
        <div className={`scenario ${isLast ? "last" : ""}`}>
            <div className="row">
                <div className="small-12 large-8 xlarge-6 column scenario-column">
                    <h4
                        className={`toggle scenario-title ${getScenarioTitleStatusClass(scenario)}`}
                        onClick={() => toggleScenario(scenario)}
                    >
                        <i
                            className={`fa ${scenario.expanded ? "fa-angle-down" : "fa-angle-right"} scenario-expand-icon`}
                        />
                        {scenario.classTitle &&
                            groupName !== scenario.classTitle &&
                            scenario.classTitle !== pageTitle && (
                                <span className="scenario-group-name">{scenario.classTitle}</span>
                            )}
                        {capitalize(scenario.description)}
                        {scenario.scenarioCases.length > 1 && (
                            <span className="secondary radius label case-count">
                                {scenario.scenarioCases.length}
                            </span>
                        )}
                        {scenario.extendedDescription && (
                            <i
                                className="scenario-extended-description-icon fa fa-question-circle"
                                title="Extended description available"
                            />
                        )}
                        {scenario.executionStatus === "SUCCESS" && (
                            <i className="check fa fa-check-square" />
                        )}
                        {scenario.executionStatus === "FAILED" && (
                            <span className="failed label radius alert">
                                <i className="fa fa-exclamation-circle" />
                                {getNumberOfFailedCases(scenario)} FAILED
                            </span>
                        )}
                        {scenario.executionStatus === "ABORTED" && (
                            <span className="aborted label radius secondary">
                                <i className="fa fa-fa-ban" />
                                {getNumberOfAbortedCases(scenario)} ABORTED
                            </span>
                        )}
                        {(scenario.executionStatus === "SCENARIO_PENDING" ||
                            scenario.executionStatus === "SOME_STEPS_PENDING") && (
                            <span className="pending label radius secondary">
                                <i className="fa fa-ban" /> PENDING
                            </span>
                        )}
                        <span className="duration">
                            {" "}
                            ({nanosToReadableUnit(scenario.durationInNanos)})
                        </span>
                    </h4>

                    {scenario.expanded && (
                        <div className="scenario-content">
                            {scenario.extendedDescription && (
                                <div
                                    className="scenario-extended-description"
                                    dangerouslySetInnerHTML={{
                                        __html: scenario.extendedDescription
                                    }}
                                />
                            )}
                            {displayCases.map(scenarioCase => (
                                <div key={scenarioCase.caseNr}>
                                    {scenario.scenarioCases.length > 1 &&
                                        !scenario.casesAsTable && (
                                            <h5
                                                className={`scenario-case-title toggle ${getScenarioCaseTitleStatusClass(scenarioCase.status)}`}
                                                onClick={() => {
                                                    scenarioCase.expanded = !scenarioCase.expanded;
                                                    bumpRender();
                                                }}
                                            >
                                                <i
                                                    className={`fa ${scenarioCase.expanded ? "fa-angle-down" : "fa-angle-right"} case-expand-icon`}
                                                />
                                                Case {scenarioCase.caseNr}:{" "}
                                                {scenarioCase.description ??
                                                    scenario.explicitParameters
                                                        ?.map(
                                                            (param, idx) =>
                                                                `${param} = ${scenarioCase.explicitArguments?.[idx]}`
                                                        )
                                                        .join(", ")}
                                                {scenarioCase.status === "FAILED" && (
                                                    <span className="failed label radius alert">
                                                        <i className="fa fa-exclamation-circle" />{" "}
                                                        FAILED
                                                    </span>
                                                )}
                                                {(scenarioCase.durationInNanos ?? 0) > 10000000 && (
                                                    <span className="duration">
                                                        {" "}
                                                        (
                                                        {nanosToReadableUnit(
                                                            scenarioCase.durationInNanos!
                                                        )}
                                                        )
                                                    </span>
                                                )}
                                            </h5>
                                        )}
                                    {(scenario.scenarioCases.length === 1 ||
                                        scenario.casesAsTable ||
                                        scenarioCase.expanded) && (
                                        <div className="steps">
                                            <table className="steps">
                                                <tbody>
                                                    {scenarioCase.steps.map((step, si) => (
                                                        <StepRow
                                                            key={si}
                                                            step={step}
                                                            scenario={scenario}
                                                            scenarioCase={scenarioCase}
                                                        />
                                                    ))}
                                                </tbody>
                                            </table>
                                            {!scenario.casesAsTable &&
                                                scenarioCase.status === "FAILED" && (
                                                    <div data-alert className="alert-box alert">
                                                        <pre className="exception">
                                                            <span
                                                                className="toggle"
                                                                onClick={() => {
                                                                    scenarioCase.stackTraceExpanded =
                                                                        !scenarioCase.stackTraceExpanded;
                                                                    bumpRender();
                                                                }}
                                                            >
                                                                <i
                                                                    className={`fa fa-fws fa-caret-right toggle ${scenarioCase.stackTraceExpanded ? "fa-rotate-90" : ""}`}
                                                                />
                                                                FAILED:
                                                            </span>{" "}
                                                            {scenarioCase.errorMessage}
                                                            {scenarioCase.stackTraceExpanded &&
                                                                scenarioCase.stackTrace &&
                                                                "\n" +
                                                                    scenarioCase.stackTrace.join(
                                                                        "\n"
                                                                    )}
                                                        </pre>
                                                    </div>
                                                )}
                                            {scenario.casesAsTable && (
                                                <CasesTable scenario={scenario} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="class-name">
                                <HashNavLink
                                    hashHref={`#class/${scenario.className}`}
                                    to={`/class/${encodeURIComponent(scenario.className)}`}
                                >
                                    {scenario.className}
                                </HashNavLink>
                            </div>
                        </div>
                    )}
                </div>
                <div className="small-12 large-4 xlarge-6 column tag-column">
                    {scenario.tagIds.map(tagId => {
                        const tag = getTagByTagId(tagId);
                        return (
                            <HashNavLink
                                key={tagId}
                                hashHref={getUrlFromTag(tag)}
                                to={hashToPath(getUrlFromTag(tag))}
                            >
                                <span
                                    className={`${getCssClassOfTag(tag)} radius label tag`}
                                    style={
                                        getStyleOfTag(tag)
                                            ? {
                                                  backgroundColor: tag.color
                                              }
                                            : undefined
                                    }
                                >
                                    {tagIdToString(tagId)}
                                </span>
                            </HashNavLink>
                        );
                    })}
                    <HashNavLink
                        hashHref={`#scenario/${scenario.className}/${scenario.testMethodName}`}
                        to={`/scenario/${encodeURIComponent(scenario.className)}/${encodeURIComponent(scenario.testMethodName)}`}
                    >
                        <i
                            className="fa fa-link scenario-link-icon"
                            title="Direct link to this scenario"
                        />
                    </HashNavLink>
                </div>
            </div>
        </div>
    );
}
