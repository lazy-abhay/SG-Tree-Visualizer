function createSegmentTree() {
    const input = document.getElementById("arrayInput").value;
    if (!input.trim()) {
        alert("Please enter an array!");
        return;
    }

    const inputArray = input.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num));

    if (inputArray.length === 0 || inputArray.length > 8) {
        alert("Invalid input. Please enter up to 8 numbers separated by commas.");
        return;
    }

    window.segmentTree = new SegmentTree(inputArray);
    visualizeTree(window.segmentTree);
}

function querySegmentTree() {
    const left = parseInt(prompt("Enter left index:"));
    const right = parseInt(prompt("Enter right index:"));

    if (isNaN(left) || isNaN(right) || left < 0 || right >= window.segmentTree.n || left > right) {
        alert("Invalid query range!");
        return;
    }

    const result = window.segmentTree.query(0, 0, window.segmentTree.n - 1, left, right);
    alert(`Sum in range [${left}, ${right}] = ${result}`);
}

function updateSegmentTree() {
    const index = parseInt(prompt("Enter index to update:"));
    const value = parseInt(prompt("Enter new value:"));

    if (isNaN(index) || isNaN(value) || index < 0 || index >= window.segmentTree.n) {
        alert("Invalid update operation!");
        return;
    }

    window.segmentTree.update(0, 0, window.segmentTree.n - 1, index, value);
    visualizeTree(window.segmentTree);  // Re-render the tree after update
}

function visualizeTree(segmentTree) {
    const svg = d3.select("#treeContainer");
    svg.selectAll("*").remove();

    const nodes = [];
    const links = [];

    const maxDepth = Math.ceil(Math.log2(segmentTree.n)) + 1;
    const baseOffset = 50;

    function addNode(index, depth, xPos) {
        if (index >= segmentTree.tree.length || segmentTree.tree[index] === null) return;

        const yPos = depth * 100 + 150;
        nodes.push({
            id: index,
            value: segmentTree.tree[index].sum,
            left: segmentTree.tree[index].left,
            right: segmentTree.tree[index].right,
            x: xPos,
            y: yPos
        });

        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        const offset = baseOffset * (1.5 ** (maxDepth - 1.9 * depth));

        if (leftChild < segmentTree.tree.length && segmentTree.tree[leftChild] !== null) {
            links.push({ source: index, target: leftChild });
            addNode(leftChild, depth + 1, xPos - offset);
        }
        if (rightChild < segmentTree.tree.length && segmentTree.tree[rightChild] !== null) {
            links.push({ source: index, target: rightChild });
            addNode(rightChild, depth + 1, xPos + offset);
        }
    }

    addNode(0, 0, window.innerWidth / 2 - 230);

    // Draw edges
    links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        svg.append("line")
            .attr("x1", sourceNode.x)
            .attr("y1", sourceNode.y)
            .attr("x2", targetNode.x)
            .attr("y2", targetNode.y)
            .attr("stroke", "white");
    });

    // Draw nodes (Rectangles)
    nodes.forEach(node => {
        svg.append("rect")
            .attr("x", node.x - 35)
            .attr("y", node.y - 25)
            .attr("width", 70)
            .attr("height", 50)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("fill", "#1e90ff")
            .attr("stroke", "white");

        svg.append("text")
            .attr("x", node.x)
            .attr("y", node.y - 5)
            .attr("text-anchor", "middle")
            .text(`${node.value}`);

        svg.append("text")
            .attr("x", node.x)
            .attr("y", node.y + 15)
            .attr("text-anchor", "middle")
            .text(`[${node.left}, ${node.right}]`);
    });
}
