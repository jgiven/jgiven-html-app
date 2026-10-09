import type { Scenario, TestClass } from "../types/jgivenReport";
import { getTestCases } from "./dataService";
import { splitClassName } from "../util/format";

export interface PackageNode {
    nodeName: () => string;
    url: () => string;
    leafs: () => ClassNode[];
    childNodes: () => PackageNode[];
    hasChildren: () => boolean;
    expanded?: boolean;
}

export interface ClassNode {
    fullQualifiedName: () => string;
    nodeName: () => string;
    url: () => string;
}

interface PackageObj {
    qualifiedName: string;
    name: string;
    classes: ClassNode[];
    packages: PackageNode[];
}

const packageNodeMap: Record<string, PackageNode & { packageObj: PackageObj }> = {};
let classNameScenarioMap: Record<string, TestClass> = {};
let rootPackage: PackageNode | null = null;

export function initClassService(): void {
    classNameScenarioMap = {};
    Object.keys(packageNodeMap).forEach(k => delete packageNodeMap[k]);
    rootPackage = null;
    getTestCases().forEach(testCase => {
        classNameScenarioMap[testCase.className] = testCase;
    });
    rootPackage = buildRootPackage();
}

function createPackageNode(packageObj: PackageObj): PackageNode & {
    packageObj: PackageObj;
    addClassNode: (c: ClassNode) => void;
    addPackageNode: (p: PackageNode) => void;
} {
    return {
        packageObj,
        nodeName: () => packageObj.name,
        url: () => "#package/" + packageObj.qualifiedName,
        leafs: () => packageObj.classes,
        childNodes: () => packageObj.packages,
        hasChildren: () => packageObj.packages.length + packageObj.classes.length > 0,
        addClassNode: (classNode: ClassNode) => {
            packageObj.classes.push(classNode);
        },
        addPackageNode: (packageNode: PackageNode) => {
            packageObj.packages.push(packageNode);
        },
        expanded: false
    };
}

function createClassNode(classObj: { className: string; packageName: string }): ClassNode {
    return {
        fullQualifiedName: () =>
            (classObj.packageName ? classObj.packageName + "." : "") + classObj.className,
        nodeName: () => classObj.className,
        url: () =>
            "#class/" +
            ((classObj.packageName ? classObj.packageName + "." : "") + classObj.className)
    };
}

function getPackageNode(packageName: string): PackageNode & {
    addClassNode: (c: ClassNode) => void;
    addPackageNode: (p: PackageNode) => void;
} {
    let packageNode = packageNodeMap[packageName];
    if (!packageNode) {
        const index = packageName.lastIndexOf(".");
        const simpleName = packageName.substr(index + 1);

        const packageObj: PackageObj = {
            qualifiedName: packageName,
            name: simpleName,
            classes: [],
            packages: []
        };

        packageNode = createPackageNode(packageObj);
        packageNodeMap[packageName] = packageNode;

        if (simpleName !== "") {
            const parentPackage = getPackageNode(packageName.substring(0, index));
            parentPackage.addPackageNode(packageNode);
        }
    }
    return packageNode;
}

function buildRootPackage(): PackageNode {
    const root = getPackageNode("");
    getTestCases().forEach(testClass => {
        const classObj = splitClassName(testClass.className);
        getPackageNode(classObj.packageName).addClassNode(createClassNode(classObj));
    });
    return root;
}

export function getRootPackage(): PackageNode {
    if (!rootPackage) initClassService();
    return rootPackage!;
}

export function getTestCaseByClassName(className: string): TestClass | undefined {
    if (!rootPackage) initClassService();
    return classNameScenarioMap[className];
}

function collectScenariosFromPackage(packageName: string, scenarios: Scenario[]): void {
    const packageNode = packageNodeMap[packageName];
    if (!packageNode) return;
    packageNode.leafs().forEach(clazzNode => {
        const testCase = classNameScenarioMap[clazzNode.fullQualifiedName()];
        if (testCase) {
            scenarios.push(...testCase.scenarios);
        }
    });
    packageNode.childNodes().forEach(subpackageNode => {
        const subPkg = subpackageNode as PackageNode & { packageObj: PackageObj };
        collectScenariosFromPackage(subPkg.packageObj.qualifiedName, scenarios);
    });
}

export function getScenariosOfPackage(packageName: string): Scenario[] {
    if (!rootPackage) initClassService();
    const scenarios: Scenario[] = [];
    collectScenariosFromPackage(packageName, scenarios);
    return scenarios;
}

export function orderNodes(node: { nodeName: () => string }): string {
    return node.nodeName();
}
