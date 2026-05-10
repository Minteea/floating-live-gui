import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 获取脚本所在目录，用于定位项目根目录
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

async function updateReadmeVersion() {
    // 读取 package.json 获取当前版本
    const pkgPath = resolve(root, 'package.json');
    const pkgRaw = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgRaw);
    const newVersion = pkg.version;

    // 读取 README.md
    const readmePath = resolve(root, 'README.md');
    let readme = await readFile(readmePath, 'utf-8');

    // 替换 <!--/version--> ... <!--/--> 中的版本号
    const versionRegex = /(<!--\/version-->\s*)([^<]+?)(\s*<!--\/-->)/g;

    let matchCount = 0;
    let replaceCount = 0;
    const MAX_VERSION_LENGTH = 30;

    readme = readme.replace(versionRegex, (match, p1, p2, p3) => {
        matchCount++;
        if (p2.length > MAX_VERSION_LENGTH) {
            console.warn(`⚠️  跳过第 ${matchCount} 处标记，中间文本长度 ${p2.length} 超过阈值 ${MAX_VERSION_LENGTH}。`);
            return match;
        }
        replaceCount++;
        return `${p1}${newVersion}${p3}`;
    });

    if (matchCount === 0) {
        console.warn('⚠️  未在 README.md 中找到版本标记，跳过更新。');
    } else if (replaceCount === 0) {
        console.warn('⚠️  所有版本标记均因内容过长被跳过，未更新任何版本号。');
    } else {
        console.log(`✅ 已将 README.md 中的版本号更新为 ${newVersion} (替换了 ${replaceCount}/${matchCount} 处标记)`);
    }

    // 写回文件
    await writeFile(readmePath, readme, 'utf-8');
    console.log(`✅ 已将 README.md 中的版本号更新为 ${newVersion}`);
}

updateReadmeVersion().catch((err) => {
    console.error('❌ 更新 README 版本号失败:', err);
    process.exit(1);
});