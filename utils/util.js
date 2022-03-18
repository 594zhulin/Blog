const formatTreeData = (data, parent_id = 0) => {
    let treeData = [];
    data.map((item) => {
        if (item.parent_id === parent_id) {
            item.children = formatTreeData(data, item.id);
            treeData.push(item);
        }
    });
    return treeData;
}

module.exports = formatTreeData;