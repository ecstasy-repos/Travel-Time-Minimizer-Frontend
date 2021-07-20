<template>
   <div>
      <v-toolbar dark :color="black">
      <v-spacer></v-spacer>
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
      <span id="question"> </span
      >
    </center>
    <br>
    <br>
    <div v-if="tableon">
    <v-container fluid>
          <v-row>
            <v-col cols="4">
    <v-autocomplete
                v-model="selectedSource"
                :items="desserts"
                class="mt-2"
                label="Source"
                outlined
                dense
                hide-details
                item-value="from"
                item-text="from"
                :loading="isLoading"
              />
              <v-autocomplete
                v-model="selectedDestination"
                :items="desserts"
                label="Destination"
                outlined
                dense
                class="mt-4"
                hide-details
                item-value="to"
                item-text="to"
                :loading="isLoading"
              />
              <br>
               <v-btn color="success" @click="createGraph()">CREATE GRAPH</v-btn>
               <v-btn color="primary" @click="add()">Add</v-btn>
            </v-col>
          
           <v-col cols="1"></v-col>
            <v-col cols="4">

            </v-col>
            </v-row>
    </v-container>
    
            <v-data-table
    :headers="headers"
    :items="desserts"
    item-key="id"
    v-model="selectedRows"
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
        GRAPH:{},
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
          console.log(item.name);
        },
        createGraph(){
            this.tableon = false;
            this.GRAPH = {
              "src" : this.selectedSource,
              "des" : this.selectedDestination,
              "EDGE_LIST" : this.desserts
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
                 axios.get("http://localhost:9090/")
                       .then(response => {
                                            console.log(response.data);
                                            this.desserts = response.data;
                                          });
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
                 axios.get("http://localhost:9090/")
                       .then(response => {
                                            console.log(response.data);
                                            this.desserts = response.data;
                                          });
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
                })
                .catch((error)=>{
                 console.log(error)
               })
          console.log("delete button clicked!!" + id);
//refresh
          axios.get("http://localhost:9090/")
                       .then(response => {
                                            console.log(response.data);
                                            this.desserts = response.data;
                                          });

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
                                            console.log(response.data);
                                            this.desserts = response.data;
                                          });
                  alert("file uploaded");
            });
        },


      },
      mounted() {
        axios.get("http://localhost:9090/")
        .then(response => {
          console.log(response.data);
          this.desserts = response.data;
        });
        
  },
      computed: {
              isLoading: function () {
                      return !this.desserts.length;
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
</style>

