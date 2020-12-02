<template>
  <div class="movies-pagination d-flex justify-content-center">
    <BPagination
      v-model="currentPageModel"
      :per-page="perPage"
      :total-rows="total"
      prev-text="Prev"
      next-text="Next"
    />
  </div>
</template>

<script>
export default {
  name: "MoviesPagination",
  //Props из сторы movies
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 1
    }
  },
  computed: {
    currentPageModel: {
      get() {
        return this.currentPage;
      }, //get буду забирать текущее значение currentPage    и устанавливаю ее в качестве v-model и использую computed как v-model
      set(value) {
        this.$emit("pageChanged", value);
      } // set буду передавать новое значение которое было изменено и $EMITить его
    }
  }
};
</script>

<style scoped>
.movies-pagination {
  margin-top: auto;
}

/*перебиваю стили Бутстрапа*/
.movies-pagination >>> .pagination .page-item .page-link {
  background-color: transparent;
  font-size: 12px;
  color: #fff;
  box-shadow: none;
}

.movies-pagination >>> .pagination .page-item.active .page-link {
  border-color: #fff;
  background-color: #fff;
  color: black;
}

.movies-pagination >>> .pagination .page-item.disabled .page-link {
  color: lightgray;
}
</style>
