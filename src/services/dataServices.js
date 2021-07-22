import axios from "axios";

class RouteDataService {
  getAll(params) {
    var url =
      "https://travel-time-minimizer-api.herokuapp.com/" +
      "?page=" +
      params.page +
      "&page_size=" +
      params.pageSize +
      "&q=" +
      params.seachQuery;
    return axios.get(url).then((response) => {
      return response;
    });
  }
}

export default new RouteDataService();
