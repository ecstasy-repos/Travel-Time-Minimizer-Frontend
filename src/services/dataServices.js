import axios from "axios";

class RouteDataService {
  getAll(params) {
    var url = "http://localhost:9090/" + "?page="+ params.page +"&page_size=" + params.pageSize + "&q=" + params.seachQuery;
   return axios.get(url)
        .then(response => {
          return response;
        });
  }

}

export default new RouteDataService();
