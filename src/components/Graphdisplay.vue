<template>
    <div>
       <v-flex id="container1">
            <div id="FIRST_HALF"></div>
        </v-flex>
              <div id="buttons">
              <br>
              <center>
                  <button type="button" class="btn btn-success" id="NEW_GRAPH">Preview Graph</button>
                  <!-- <button type="button" class="btn btn-secondary" id="solve">SOLUTION</button> -->
                  <v-btn color="primary" id="solve" >SOLUTION</v-btn>
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
        for(var i=0;i<this.graph.EDGE_LIST.length;i++)
        {
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
    var IIT1 = document.getElementById('IIT1');
    var IIT2 = document.getElementById('IIT2'); 
    var distance = document.getElementById('distance');
    var container1 = document.getElementById('FIRST_HALF');
    var container2 = document.getElementById('SECOND_HALF');
    var newGraph = document.getElementById('NEW_GRAPH');
    var solve = document.getElementById('solve');
    var answer = document.getElementById('answer');
    var temptext = document.getElementById('info');
    var temptext2 = document.getElementById('question');
    //const IITS = ['IIT Palakkad', 'IIT Bombay', 'IIT Gandhinagar', 'IIT Goa', 'IIT Kanpur', 'IIT Jammu', 'IIT Hyderabad', 'IIT Dharwad', 'IIT Delhi', 'IIT Guwahati', 'IIT BHU', 'IIT Madras', 'IIT Roorkee', 'IIT Patna', 'IIT Jodhpur', 'IIT Indore', 'IIT Dhanbad', 'IIT Ropar', 'IIT Mandi', 'IIT Bhilai', 'IIT Bhubhaneshwar', 'IIT Tirupati'];

    // initialise graph options
    const options = {
        edges: {
            labelHighlightBold: true,
            font: {
                size: 20
            },
            width: 3
        },
        nodes: {
            font: '20px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf19c',
                size: 40,
                color: '#ada8a6',
            }
        }
    };

    // Initialize your network!
    // Network for question graph
    var network = new vis.Network(container1);
    network.setOptions(options);
    var edge_list_temp = this.graph.EDGE_LIST;
    // Network for result graph
    var edges = [];
    function createData() {
        V = IITS.length;
        let nodes = [];
        for (let i = 0; i < V; i++) {
            nodes.push({
                id: i + 1,
                label: IITS[i]
            })
        }
        // Prepares vis.js style nodes for our data
        //        nodes = new vis.DataSet(nodes);

        // Creating a tree like underlying graph structure
        
        let edge_list = [];

      for (var i = 0; i < edge_list_temp.length; i++) {
        console.log("from: " + index_map[edge_list_temp[i].from]);
        console.log("to: " + index_map[edge_list_temp[i].to]);
        console.log("label: " + String(edge_list_temp[i].road_way_time) + "hr");
        edge_list.push({
          type: 0,
          from: index_map[edge_list_temp[i].from] + 1,
          to: index_map[edge_list_temp[i].to] + 1,
          color: '#1aba72',
          label: String(edge_list_temp[i].road_way_time)
        });

        edge_list.push({
          type: 1,
          from: index_map[edge_list_temp[i].from] + 1,
          to: index_map[edge_list_temp[i].to] + 1,
          color: '#4f34eb',
          label: String(edge_list_temp[i].areal_time),
           
        });
      }

      for(var i=0;i<edge_list.length;i++)
      {
          console.log(edge_list[i]);
      }













        // for (let i = 2; i <= V; i++) {
        //     let neigh = i - Math.floor(Math.random() * Math.min(i - 1, 3) + 1); // Picks a neighbour from i-3 to i-1
        //     edges.push({
        //         type: 0,
        //         from: i,
        //         to: neigh,
        //         color: '#1aba72',
        //         label: String(Math.floor(Math.random() * 65) + 56)
        //     });
        // }

        // // Randomly adding new edges to graph
        // // Type of bus is 0
        // // Type of plane is 1
        // for (let i = 1; i <= V / 2;) {

        //     let n1 = Math.floor(Math.random() * V) + 1;
        //     let n2 = Math.floor(Math.random() * V) + 1;
        //     if (n1 !== n2) {
        //         if (n1 < n2) { //swap in that case so that higher one is at first
        //             let temp = n1;
        //             n1 = n2;
        //             n2 = temp;
        //         }
        //         // Seeing if an edge between these two vertices already exists
        //         // And if it does then of which kind
        //         let works = 0;
        //         for (let j = 0; j < edges.length; j++) {
        //             if (edges[j]['from'] === n1 && edges[j]['to'] === n2) {
        //                 if (edges[j]['type'] === 0)
        //                     works = 1;
        //                 else
        //                     works = 2;
        //             }
        //         }

        //         // Adding edges to the graph
        //         // If works == 0, you can add bus as well as plane between vertices
        //         // If works == 1, you can only add plane between them
        //         if (works <= 1) {
        //             if (works === 0 && i < V / 4) {
        //                 // Adding a bus
        //                 edges.push({
        //                     type: 0,
        //                     from: n1,
        //                     to: n2,
        //                     color: '#1aba72',
        //                     label: String(Math.floor(Math.random() * 65) + 56)
        //                 });
        //             } else {
        //                 // Adding a plane
        //                 edges.push({
        //                     type: 1,
        //                     from: n1,
        //                     to: n2,
        //                     color: '#4f34eb',
        //                     label: String(Math.floor(Math.random() * 40) + 1)
        //                 });
        //             }
        //             i++;
        //         }
        //     }
        // }

        // Setting the new values of global variables
        src = index_map[String(GRAPH.src)] + 1;
        console.log("src->" + src);
        des = index_map[String(GRAPH.des)] + 1;
        console.log("des->" + des);
        curr_data = {
            nodes: nodes,
            edges: edge_list
        };
    }

    newGraph.onclick = function () {
        // Create new data and display the data
        createData();
        network.setData(curr_data);
       // IIT1.innerText = IITS[src - 1];
       // IIT2.innerText = IITS[des - 1];
      //  temptext.style.display = "inline";
      //  temptext2.style.display = "inline";
      //  container2.style.display = "none";
      //  distance.style.display = "none";
       // req_dis = 0;
      //  answer.innerText = "FIRST TRY OUT !!!";

    };

    solve.onclick = function () {
        // Create graph from data and set to display
        //        temptext.style.display  = "none";
        //        temptext2.style.display  = "none";
     //   distance.style.display = "inline-block";
        network.setData(solveData());
     //   answer.innerText = "REQUIRED SHORTEST PATH LENGTH IS : ";
      //  distance.innerText = req_dis;
        //        console.log(req_dis);
        console.log(req_dis);
    };

    function dijkstra(graph, V, src) {
        let vis = Array(V).fill(0);
        let dist = [];
        for (let i = 1; i <= V; i++)
            dist.push([10000, -1]);
        dist[src][0] = 0;

        for (let i = 0; i < V - 1; i++) {
            let mn = -1;
            for (let j = 0; j < V; j++) {
                if (vis[j] === 0) {
                    if (mn === -1 || dist[j][0] < dist[mn][0])
                        mn = j;
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

        for (let i = 0; i < data['edges'].length; i++) {
            let edge = data['edges'][i];
            if (edge['type'] === 1) {
                continue;
            }
            graph[edge['to'] - 1].push([edge['from'] - 1, Number(edge['label'])]);
            graph[edge['from'] - 1].push([edge['to'] - 1, Number(edge['label'])]);
        }
        return graph;
    }

    function needTakePlane(edges, dist1, dist2, mn_dist) {
        let plane = 0;
        let p1 = -1,
            p2 = -1;
        for (let pos in edges) {
            let edge = edges[pos];
            if (edge['type'] === 1) {
                let to = edge['to'] - 1;
                let from = edge['from'] - 1;
                let wght = Number(edge['label']);
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
            p2
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
        let {
            plane,
            p1,
            p2
        } = needTakePlane
            (data['edges'], dist1, dist2, mn_dist);

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
                        enabled: true
                    }
                },
                from: p1 + 1,
                to: p2 + 1,
                color: '#4f34eb',
                label: String(plane)
            });
            // Using spread operator to push elements of result of pushEdges to new_edges
            new_edges.push(...pushEdges(dist1, p1, false));
            new_edges.push(...pushEdges(dist2, p2, true));
        } else {
            new_edges.push(...pushEdges(dist1, des - 1, false));
        }
        const ans_data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        req_dis += plane;
        return ans_data;
    }
    var req_dis = 0;

    function pushEdges(dist, curr, reverse) {
        var flag = 0;
        let tmp_edges = [];
        while (dist[curr][0] !== 0) {
            let fm = dist[curr][1];
            if(fm == -1)
            {   flag = 1;
                break;
            }
            req_dis += (dist[curr][0] - dist[fm][0]);
            if (reverse)
                tmp_edges.push({
                    arrows: {
                        to: {
                            enabled: true
                        }
                    },
                    from: curr + 1,
                    to: fm + 1,
                    color: '#1aba72',
                    label: String(dist[curr][0] - dist[fm][0])
                });
            else
                tmp_edges.push({
                    arrows: {
                        to: {
                            enabled: true
                        }
                    },
                    from: fm + 1,
                    to: curr + 1,
                    color: '#1aba72',
                    label: String(dist[curr][0] - dist[fm][0])
                });
            curr = fm;
        }
        console.log("Unreachable!!! Graph is disconnected...");
        return tmp_edges;
    }

       newGraph.click();
       
    },
}
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
    font-size: x-large
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