import dagre from "@dagrejs/dagre";

const graph = new dagre.graphlib.Graph();

graph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 300;
const NODE_HEIGHT = 130;

export function getLayoutedElements(nodes, edges) {
  graph.setGraph({
    rankdir: "TB",      // Top -> Bottom
    ranksep: 120,       // Vertical spacing
    nodesep: 100,       // Horizontal spacing
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const pos = graph.node(node.id);

    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}