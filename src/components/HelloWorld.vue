<template>
   <div>
      <v-toolbar dark :color="black">
      <v-spacer><button class="btn1" v-on:click="load()"><i class="fa fa-home"></i> Home</button></v-spacer>
      <div id="title1">SHORTEST-PATH-FINDING PROJECT</div>
      <v-spacer></v-spacer>
      <div>
        <div class="container">
            <form @submit.prevent="onSubmit">
                <div class="form-group">
                    <input type="file" @change="onFileUpload" accept=".csv" />
                    <button class="btn btn-primary btn-sm">
                        Upload CSV-FILE
                    </button>
                </div>
            </form>
        </div>
    </div>
    </v-toolbar>
    <center>
      <span id="question"> Enter Source and Destination : </span>
    </center>
    <div v-if="tableon">
    <v-container fluid>
          <v-row>
            <v-col cols="4">
    <v-autocomplete
                v-model="selectedSource"
                :items="routes"
                class="mt-2"
                label="Source"
                outlined
                dense
                hide-details
                :loading="isLoading"
              />
              <v-autocomplete
                v-model="selectedDestination"
                :items="routes"
                label="Destination"
                outlined
                dense
                class="mt-4"
                hide-details
                :loading="isLoading"
              />
              <br>
               <v-btn color="success" @click="createGraph()">CREATE GRAPH</v-btn>
               <v-btn color="primary" @click="add()">Add</v-btn>
            </v-col>
          
           <v-col cols="1"></v-col>
            <v-col cols="4">
                <input
          type="text"
          class="form-control"
          placeholder="Universal Search"
          v-model="searchQuery"
        />
        <br>
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="page = 1; retrieveRouteDetails();"
          >
            Search
          </button>
        </div>
            </v-col>
            </v-row>
    </v-container>
    
            <v-data-table
    :headers="headers"
    :items="desserts"
    item-key="id"
    v-model="selectedRows"
     hide-default-footer
    class="elevation-1"
    bgcolor="red">
      <template v-slot:item="{ item }">
        <tr :class="selectedRows.indexOf(item.id)>-1?'cyan':''" @click="rowClicked(item)">
            <td>{{item.id}}</td>
            <td>{{item.from}}</td>
            <td>{{item.to}}</td>
            <td>{{item.road_way_time}}</td>
            <td>{{item.areal_time}}</td>
        </tr>
        
    </template>
</v-data-table>
        
        <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        
      </div>
    </div>

    <div class="col-md-12">
      <div class="mb-3">
        <b>Items per Page:</b>
        <select v-model="pageSize" @change="handlePageSizeChange($event)">
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <b-pagination
        v-model="page"
        :total-rows="count"
        :per-page="pageSize"
        prev-text="Prev"
        next-text="Next"
        @change="handlePageChange"
      ></b-pagination>
    </div>
    
    </div>
             
             
    <!-- <div class="col-md-6">
      <h4>Routes List</h4>
      <ul class="list-group" id="routes-list">
        <li
          class="list-group-item"
          v-for="(route, index) in desserts"
          :key="index"
        >
          {{ route.id }}
        </li>
      </ul>
    </div> -->


        <v-dialog v-model="dialogDetails">
          <v-card>

              <h2><center>Edit the Details:</center></h2>
                    <v-container grid-list-md text-xs-center>
                <v-flex xs6>
                  <v-text-field
                    v-model="detailEdit.from"
                    label="Source"
                    placeholder="Source"
                    outlined
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-model="detailEdit.to"
                    label="Destination"
                    placeholder="Destination"
                    outlined
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-model="detailEdit.road_way_time"
                    label="RoadWays Time"
                    placeholder="RoadWays Time"
                    outlined
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-model="detailEdit.areal_time"
                    label="AirWays Time"
                    placeholder="AirWays Time"
                    outlined
                  ></v-text-field>
                </v-flex>
                <v-btn color="success" @click="edit(detailEdit)">Edit</v-btn>
                <v-btn color="error" @click="delete1(detailEdit.id)">Delete</v-btn>
                  </v-container>
          </v-card>
        </v-dialog>


<v-dialog v-model="AddDialog">
          <v-card>
              <h2><center>Add Route Details:</center></h2>
                    <v-container grid-list-md text-xs-center>
                <v-flex xs6>
                  <v-text-field
                    v-model="load_from"
                    label="Source"
                    placeholder="Source"
                    outlined
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-model="load_to"
                    label="Destination"
                    placeholder="Destination"
                    outlined
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-model="load_rwt"
                    label="RoadWays Time"
                    placeholder="RoadWays Time"
                    outlined
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                    v-model="load_at"
                    label="AirWays Time"
                    placeholder="AirWays Time"
                    outlined
                  ></v-text-field>
                </v-flex>
                <v-btn color="primary" @click="save1()">Save</v-btn>
                  </v-container>
          </v-card>
        </v-dialog>

    </div>

          <div v-else>
            <Graphdisplay v-bind:graph="GRAPH"></Graphdisplay>
          </div>
   </div>
</template>
<script>
import axios from 'axios';
import { post } from "axios";
import Graphdisplay from "./Graphdisplay.vue"
import RouteDataService from "../services/dataServices";
  export default {
    name: 'HelloWorld',
    components:{
      Graphdisplay
    },
    data: () => ({
        FILE: null,
        black:"black",
        selectedSource:"",
        selectedDestination:"",
        tableon: true,
        AddDialog: false,
        dialogDetails: false,
        detailEdit:{},
        selectedRows:[],
        load_from:"",
        load_to:"",
        load_rwt:"",
        load_at:"",
        currentPage: 1,
        rows: 0,
        perPage: 5,
        GRAPH:{},
        params:{},
        routes: [],
        actual_data:[],
      currentRoute: null,
      currentIndex: -1,
      searchQuery: "",

      page: 1,
      count: 0,
      pageSize: 4,

      pageSizes: [2, 4, 6, 8],

        //payload:{},
        headers: [
          { text: 'ID', align: 'start', sortable: true, value: 'id'},
          { text: 'Source', value: 'from' },
          { text: 'Destination', value: 'to' },
          { text: 'Road Way Time (in hours)', value: 'road_way_time' },
          { text: 'Airway Time (in hourse)', value: 'areal_time' },
         // { text: 'Delete', value: 'delete' },
         
        ],
        desserts: [
        ],
        desserts_Destination:[],
        desserts_Source:[]
      }),
      methods: {
        rowClicked(item){
          this.dialogDetails = true;
          this.detailEdit = item
          console.log(item.id);
        },
        createGraph(){
            this.tableon = false;
            this.GRAPH = {
              "src" : this.selectedSource,
              "des" : this.selectedDestination,
              "EDGE_LIST" : this.actual_data
            }
            console.log("SelectedSource" + this.selectedSource);
            console.log("SelectedDesti" + this.selectedDestination);
        },
        save1(){
          var payload = {
            "from": this.load_from,
            "to": this.load_to,
            "road_way_time": this.load_rwt,
            "areal_time": this.load_at
          }
          axios.post("http://localhost:9090/add", payload)
               .then(response=>{
                 console.log(response);
                 this.retrieveRouteDetails();
               })
               .catch((error)=>{
                 console.log(error)
               })
               console.log(payload);
           
           
            this.AddDialog = false;
        },
        add(){
          this.AddDialog = true;
        },
        edit(item){
          axios.put("http://localhost:9090/update", item)
               .then(response=>{
                 console.log(response);
                 this.retrieveRouteDetails()
               })
               .catch((error)=>{
                 console.log(error)
               })
          console.log("edit button clicked -> " + item);
          this.dialogDetails = false;
        },
        delete1(id){
          axios.delete("http://localhost:9090/srcdes/" + id)
                .then(response=>{
                  console.log(response);
                  this.retrieveRouteDetails();
                })
                .catch((error)=>{
                 console.log(error)
               })
          console.log("delete button clicked!!" + id);
          this.dialogDetails = false;

        },
        onFileUpload(event) {
            this.FILE = event.target.files[0];
        },
        onSubmit() {
            if (this.FILE == null) {
                return;
            }
            const url = "http://localhost:9090/upload-csv";
            const formData = new FormData();
            formData.append("file", this.FILE);
            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                },
            };
            post(url, formData, config).then(() => {
                  axios.get("http://localhost:9090/")
                       .then(response => {
                                            console.log(response.data.content);
                                            this.desserts = response.data.content;
                                          });
                  alert("file uploaded");
            });
        },


      getRequestParams(searchQuery, page, pageSize) {
      let params = {};

      if (searchQuery) {
        params["q"] = searchQuery;
      }

      if (page) {
        params["page"] = page;
      }

      if (pageSize) {
        params["page_size"] = pageSize;
      }

      return params;
    },

    retrieveRouteDetails() {
      this.params = {
        "page" : this.page,
        "pageSize" : this.pageSize,
        "seachQuery": this.searchQuery
      };
      console.log("I am inside retriceRouteDetails " + this.params);
      RouteDataService.getAll(this.params)
        .then(response =>{
            this.desserts = response.data.content;
        });

    },

    handlePageChange(value) {
      this.page = value;
      console.log("handle page change called"+ value);
      this.retrieveRouteDetails();
    },

    load(){
      console.log("button pressed!!")
        this.tableon = true;
    },

    handlePageSizeChange(event) {
      this.pageSize = event.target.value;
      console.log("Pagesize changed called where new size ->" + this.pageSize);
      this.page = 1;
      this.retrieveRouteDetails();
    },



      },
      mounted() {
        axios.get("http://localhost:9090/")
        .then(response => {
          console.log(response.data);
          this.actual_data = response.data.content;
          var s1 = new Set();
            for(var i=0;i<this.actual_data.length;i++)
              {
                s1.add(this.actual_data[i].from);
                s1.add(this.actual_data[i].to);
              }
            this.routes = Array.from(s1);
            console.log(this.routes);
        });

        
        this.params = {
          "page" : 1,
          "pageSize" : 4,
          "seachQuery": ""
        }
        RouteDataService.getAll(this.params)
        .then(response =>{
            this.desserts = response.data.content;
            this.count = response.data.totalPages;
            console.log(response.data.totalPages + "totalpages");
        })
        .catch((error)=>{
          console.log(error);
        })
      //  var url = "http://localhost:9090/" + "?page="+ this.params.page +"&page_size=" + this.params.pageSize + "&q=" + this.params.seachQuery;

  },
      computed: {
              isLoading: function () {
                      return !this.routes.length;
                 },
              
      }
  }

</script>
<style scoped>
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

#question{
  align-content: flex-start;
}
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
    height: 100%;
    width: 50%;
    border: 5px solid #0286a1;
}

#container2 {
    height: 100%;
    width: 50%;
    border: 5px solid #0286a1;
    align-content: center;
}

#distance {
    color: red;
}


#SECOND_HALF {
    width: 100%;
    height: 100%;
    border: 5px solid #0286a1;
}

#container1 {
    width: 100%;
    height: 70%;
    background-color: #bbe1f2;
    border: 5px solid #0286a1;
    display: flex;
    margin: 0 auto;
}

#buttons {
    margin: auto;
}

.btn1 {
  background-color: DodgerBlue;
  border: none;
  color: white;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>

