
// 生成序列ID，避免同一时间内创建的临时目录名称冲突
let tempCount = 0;
export function getCountId() {
    return (tempCount++).toString(16).padStart(4, '0').slice(-4);
}


// 生成时间戳ID
export function getDateId() {
    return Date.now().toString(16).padStart(8, '0').slice(-8);
}


// 生成随机ID
export function getRandomId() {
    return Math.random().toString(16).slice(-4);
}