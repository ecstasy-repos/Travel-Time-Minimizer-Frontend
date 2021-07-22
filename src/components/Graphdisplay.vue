<template>
  <div>
    <center>
      <center>
        <span id="colyellow" style="color: #1aba72"><b>GREEN EDGES</b></span>
        depict Railways route
        <i class="fa fa-subway" aria-hidden="true" style="color: #1aba72"></i> &
        <span style="color: #4f34eb"><b>BLUE EDGES</b></span> depict Airways
        route
        <i
          class="fa fa-plane-departure"
          aria-hidden="true"
          style="color: #4f34eb"
        ></i>
      </center>
      <b><span id="answer">Input Graph</span></b>
    </center>
    <v-flex id="container1">
      <div id="FIRST_HALF"></div>
    </v-flex>
    <div id="buttons">
      <br />
      <center>
        <button type="button" class="btn btn-success" id="NEW_GRAPH">
          Preview Graph
        </button>
        <v-btn color="primary" id="solve">SOLUTION</v-btn>
      </center>
    </div>
  </div>
</template>
<script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<script>
export default {
  props: ["graph"],
  mounted() {
    console.log(this.graph);
    var GRAPH = this.graph;
    var s1 = new Set();
    for (var i = 0; i < this.graph.EDGE_LIST.length; i++) {
      s1.add(this.graph.EDGE_LIST[i].from);
      s1.add(this.graph.EDGE_LIST[i].to);
    }

    var actual_size = s1.size;
    var index_map = new Map();

    var f = 0;
    for (let item of s1) {
      index_map[String(item)] = f;
      f++;
    }

    for (let item of s1) {
      console.log(item + " " + index_map[item]);
    }

    const IITS = [];
    for (let item of s1) {
      IITS.push(String(item));
    }

    let curr_data, V, src, des;
    var container1 = document.getElementById("FIRST_HALF");
    var newGraph = document.getElementById("NEW_GRAPH");
    var solve = document.getElementById("solve");
    var answer = document.getElementById("answer");

    const options = {
      edges: {
        labelHighlightBold: true,
        font: {
          size: 20,
        },
        width: 3,
      },
      nodes: {
        font: "20px arial red",
        scaling: {
          label: true,
        },
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf19c",
          size: 40,
          color: "#ada8a6",
        },
      },
    };

    var network = new vis.Network(container1);
    network.setOptions(options);
    var edge_list_temp = this.graph.EDGE_LIST;

    var edges = [];
    function createData() {
      V = IITS.length;
      let nodes = [];
      for (let i = 0; i < V; i++) {
        nodes.push({
          id: i + 1,
          label: IITS[i],
        });
      }

      let edge_list = [];

      for (var i = 0; i < edge_list_temp.length; i++) {
        console.log("from: " + index_map[edge_list_temp[i].from]);
        console.log("to: " + index_map[edge_list_temp[i].to]);
        console.log("label: " + String(edge_list_temp[i].road_way_time) + "hr");
        edge_list.push({
          type: 0,
          from: index_map[edge_list_temp[i].from] + 1,
          to: index_map[edge_list_temp[i].to] + 1,
          color: "#1aba72",
          label: String(edge_list_temp[i].road_way_time),
        });

        edge_list.push({
          type: 1,
          from: index_map[edge_list_temp[i].from] + 1,
          to: index_map[edge_list_temp[i].to] + 1,
          color: "#4f34eb",
          label: String(edge_list_temp[i].areal_time),
        });
      }

      for (var i = 0; i < edge_list.length; i++) {
        console.log(edge_list[i]);
      }
      if (GRAPH.src == "" || GRAPH.des == "") {
        answer.innerText =
          "The Input Source and Destination are empty!! Please re-enter..";
      } else {
        src = index_map[String(GRAPH.src)] + 1;
        console.log("src->" + src);
        des = index_map[String(GRAPH.des)] + 1;
        console.log("des->" + des);
      }
      curr_data = {
        nodes: nodes,
        edges: edge_list,
      };
    }

    newGraph.onclick = function () {
      createData();
      network.setData(curr_data);
    };

    solve.onclick = function () {
      network.setData(solveData());
      console.log(req_dis);
      if(flag == 1)
      {
        answer.innerText = "Oops!! Disconnected Source and Destination."    
      }
      else{
        answer.innerText =
        "Minimum Travel-Time Required will be " + req_dis.toFixed(2) + " hours";
      }
      
      console.log(req_dis);
    };

    function dijkstra(graph, V, src) {
      let vis = Array(V).fill(0);
      let dist = [];
      for (let i = 1; i <= V; i++) dist.push([10000, -1]);
      dist[src][0] = 0;

      for (let i = 0; i < V - 1; i++) {
        let mn = -1;
        for (let j = 0; j < V; j++) {
          if (vis[j] === 0) {
            if (mn === -1 || dist[j][0] < dist[mn][0]) mn = j;
          }
        }
        vis[mn] = 1;
        for (let j in graph[mn]) {
          let edge = graph[mn][j];
          if (vis[edge[0]] === 0 && dist[edge[0]][0] > dist[mn][0] + edge[1]) {
            dist[edge[0]][0] = dist[mn][0] + edge[1];
            dist[edge[0]][1] = mn;
          }
        }
      }

      return dist;
    }

    function createGraph(data) {
      let graph = [];
      for (let i = 0; i < V; i++) {
        graph.push([]);
      }

      for (let i = 0; i < data["edges"].length; i++) {
        let edge = data["edges"][i];
        if (edge["type"] === 1) {
          continue;
        }
        graph[edge["to"] - 1].push([edge["from"] - 1, Number(edge["label"])]);
        graph[edge["from"] - 1].push([edge["to"] - 1, Number(edge["label"])]);
      }
      return graph;
    }

    function needTakePlane(edges, dist1, dist2, mn_dist) {
      let plane = 0;
      let p1 = -1,
        p2 = -1;
      for (let pos in edges) {
        let edge = edges[pos];
        if (edge["type"] === 1) {
          let to = edge["to"] - 1;
          let from = edge["from"] - 1;
          let wght = Number(edge["label"]);
          if (dist1[to][0] + wght + dist2[from][0] < mn_dist) {
            plane = wght;
            p1 = to;
            p2 = from;
            mn_dist = dist1[to][0] + wght + dist2[from][0];
          }
          if (dist2[to][0] + wght + dist1[from][0] < mn_dist) {
            plane = wght;
            p2 = to;
            p1 = from;
            mn_dist = dist2[to][0] + wght + dist1[from][0];
          }
        }
      }
      return {
        plane,
        p1,
        p2,
      };
    }

    function solveData() {
      const data = curr_data;

      // Creating adjacency list matrix graph from question data
      const graph = createGraph(data);

      // Applying dijkstra from src and des
      let dist1 = dijkstra(graph, V, src - 1);
      let dist2 = dijkstra(graph, V, des - 1);

      console.log("dist1 is " + dist1);
      console.log("dist2 is " + dist2);
      // Initialise min_dist to min distance via bus from src to des
      let mn_dist = dist1[des - 1][0];

      //in order to check if plane is rquired
      let { plane, p1, p2 } = needTakePlane(
        data["edges"],
        dist1,
        dist2,
        mn_dist
      );

      let new_edges = [];
      for (var i = 0; i < edges.length; i++) {
        var edges1 = edges[i];
        edges1.dashes = true;
        new_edges.push(edges1);
      }
      if (plane !== 0) {
        new_edges.push({
          arrows: {
            to: {
              enabled: true,
            },
          },
          from: p1 + 1,
          to: p2 + 1,
          color: "#4f34eb",
          label: String(plane),
        });
        // Using spread operator to push elements of result of pushEdges to new_edges
        new_edges.push(...pushEdges(dist1, p1, false));
        new_edges.push(...pushEdges(dist2, p2, true));
      } else {
        new_edges.push(...pushEdges(dist1, des - 1, false));
      }
      const ans_data = {
        nodes: data["nodes"],
        edges: new_edges,
      };
      req_dis += plane;
      return ans_data;
    }
    var req_dis = 0;
    var flag = 0;
    function pushEdges(dist, curr, reverse) {
      
      let tmp_edges = [];
      while (dist[curr][0] !== 0) {
        let fm = dist[curr][1];
        if (fm == -1) {
          flag = 1;
          break;
        }
        req_dis += dist[curr][0] - dist[fm][0];
        if (reverse)
          tmp_edges.push({
            arrows: {
              to: {
                enabled: true,
              },
            },
            from: curr + 1,
            to: fm + 1,
            color: "#1aba72",
            label: String(dist[curr][0] - dist[fm][0]),
          });
        else
          tmp_edges.push({
            arrows: {
              to: {
                enabled: true,
              },
            },
            from: fm + 1,
            to: curr + 1,
            color: "#1aba72",
            label: String(dist[curr][0] - dist[fm][0]),
          });
        curr = fm;
      }

      return tmp_edges;
    }

    newGraph.click();
  },
};
</script>

<style>
#title1 {
  font-family: cursive;
  font-size: 30px;
  color: white;
}

body {
  height: 100%;
  background-color: #8964;
}

#IIT1,
#IIT2 {
  color: red;
}

#question,
#info {
  width: 100%;
  text-align: center;
  font-size: x-large;
}

#answer {
  color: black;
}

#navtext {
  font-family: cursive;
  font-size: 30px;
  color: white;
}

#FIRST_HALF {
  border: 5px solid #0286a1;
  height: 70vh;
}

#SECOND_HALF {
  border: 5px solid #0286a1;
  display: inline-block;
  height: 500px;
}

#container1 {
  background-color: #bbe1f2;
  border: 2px solid #bbe1f2;
  margin: 0 auto;
  flex-direction: row;
}

#distance {
  color: red;
}

#buttons {
  margin: auto;
}
</style>