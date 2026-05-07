import path from "node:path";

export function isUnderDir(baseDir: string, targetPath: string) {
    const relativePath = path.relative(baseDir, targetPath);

    return (
        relativePath === "" ||
        (!relativePath.startsWith(".." + path.sep) && relativePath !== ".." && relativePath.slice(1, 3) !== ":\\")
    );


}
