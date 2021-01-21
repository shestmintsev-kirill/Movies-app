<template>
  <header class="header">
    <BNavbar type="dark" class="navbar" variant="dark">
      <BContainer>
        <BNavbarBrand>
          <router-link to="/">MovieDB</router-link>
        </BNavbarBrand>
        <BNavForm>
          <BFormInput
            class="mr-sm-2 search-input"
            placeholder="Search"
            v-model="searchValue"
            debounce="500"
          ></BFormInput>
        </BNavForm>
      </BContainer>
    </BNavbar>
  </header>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Header",
  data: () => ({
    searchValue: "" //отлавливаю Input
  }),
  watch: {
    searchValue: "onSearchValueChanged"
  },
  methods: {
    ...mapActions("movies", [
      "searchMovie",
      "fetchMovies",
      "toggleSearchState"
    ]),
    onSearchValueChanged(val) {
      if (val) {
        //если val есть то =>
        this.searchMovie(val); //данный метод будет вызываться когда пользователь будет что то вводить
        this.toggleSearchState(true); //вывод текста после поиска (в сторе isSearch меняю на true)
      } else {
        //иначе просто фетчу все фильмы(в случае если стереть search то будут выводиться заново фильмы)
        this.fetchMovies();
        this.toggleSearchState(false); //вывод дефолтного текста после поиска(в сторе isSearch меняю на false)
      }
    }
  }
};
</script>

<style scoped>
a {
  color: #fff !important;
  transition: 0.3s;
}

a:hover {
  text-decoration: none !important;
  color: rgb(190, 190, 190) !important;
}

.header {
  margin-bottom: 30px;
}

.navbar {
  background-color: rgba(
    0,
    0,
    0,
    0.7
  ) !important; /*!important потому что bootstrap задает фон на navbar ч-з important*/
}

.search-input {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(0, 0, 0, 0.6);
}

.search-input:focus {
  box-shadow: none;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(0, 0, 0, 0.6);
}
</style>
