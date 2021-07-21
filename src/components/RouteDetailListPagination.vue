<template>
    <div>
    </div>
</template>

<script>
  import RouteDataService from "../services/dataServices";

export default {

  name: "route-details-list",
  data() {
    return {
      routes: [],
      currentRoute: null,
      currentIndex: -1,
      searchQuery: "",

      page: 1,
      count: 0,
      pageSize: 3,

      pageSizes: [3, 6, 9],
    };
  },
  methods: {
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
      const params = this.getRequestParams(
        this.searchQuery,
        this.page,
        this.pageSize
      );

      RouteDataService.getAll(params)
        .then((response) => {
          const { tutorials, totalItems } = response.data.content;
          this.tutorials = tutorials;
          this.count = totalItems;

          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    

    handlePageChange(value) {
      this.page = value;
      this.retrieveTutorials();
    },

    handlePageSizeChange(event) {
      this.pageSize = event.target.value;
      this.page = 1;
      this.retrieveTutorials();
    },
</script>

<style lang="sass" scoped>

</style>

