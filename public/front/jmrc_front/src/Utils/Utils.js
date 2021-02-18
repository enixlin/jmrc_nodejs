class Utils {
    constructor() {}

    arrayToTree(list) {
        // alert("arrayToTree");
        const data = JSON.parse(JSON.stringify(list)); // 浅拷贝不改变源数据

        const result = [];
        if (!Array.isArray(data)) {
            return result;
        }
        data.forEach(item => {
            delete item.children;
        });
        const map = {};
        data.forEach(item => {
            map[item.id] = item;
        });
        data.forEach(item => {
            const parent = map[item.parent_id];
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                result.push(item);
            }
        });

        return data;
    }
}

module.exports = Utils;