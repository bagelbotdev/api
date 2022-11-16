import { Router } from "express";
import { getHostGraph } from "../../coin/hosts";

const grafanaRouter = Router();

grafanaRouter.get("/api/graph/fields", (req, res) => {
  return res.json({
    edges_fields: [
      {
        field_name: "id",
        type: "string",
      },
      {
        field_name: "source",
        type: "string",
      },
      {
        field_name: "target",
        type: "string",
      },
      {
        field_name: "mainStat",
        type: "number",
      },
    ],
    nodes_fields: [
      {
        field_name: "id",
        type: "string",
      },
      {
        field_name: "title",
        type: "string",
      },
      {
        field_name: "mainStat",
        type: "string",
      },
    ],
  });
});

grafanaRouter.get("/api/graph/data", async (req, res) => {
  const graph = await getHostGraph();

  const nodes = graph.map((ent) => ({
    id: ent.host,
    title: ent.host,
    mainStat: ent.host,
  }));

  const edges = graph
    .flatMap((node) =>
      node.edges.map((edge) => ({
        from: node.host,
        to: edge,
      }))
    )
    .filter((ent) => nodes.some(({ id }) => ent.from == id) && nodes.some(({ id }) => ent.to == id))
    .map((ent, i) => ({
      id: i,
      mainStat: i,
      source: ent.from,
      target: ent.to,
    }));

  return res.json({
    edges,
    nodes,
  });
});

grafanaRouter.get("/api/health", (req, res) => {
  return res.end("ok");
});

export default grafanaRouter;
