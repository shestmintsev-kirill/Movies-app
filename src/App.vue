<template>
  <div id="app">
    <Loader />
    <Notification />
    <PosterBg :poster="posterBg" />
    <Header />
    <MoviesList :list="moviesList" @chengePoster="onChengePoster" />
    <MoviesPagination
      :current-page="currentPage"
      :per-Page="moviesPerPage"
      :total="moviesLength"
      @pageChanged="onPageChanged"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MoviesList from "@/components/MoviesList";
import PosterBg from "@/components/PosterBg";
import MoviesPagination from "./components/MoviesPagination";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Notification from "./components/Notification";

export default {
  name: "App",
  components: {
    MoviesList,
    PosterBg,
    MoviesPagination,
    Loader,
    Header,
    Notification
  },
  data: () => ({
    posterBg: ""
  }),
  computed: {
    ...mapGetters("movies", [
      "moviesList",
      "currentPage",
      "moviesPerPage",
      "moviesLength"
    ]) //mapGetters возвращает обьект с указанными св-ми из сторы(название сторы как импортировали и [что хочу достать])
  },
  watch: {
    //хочу watch за $route.query, добавляю обработчик
    "$route.query": {
      handler: "onPageQueryChenge",
      immediate: true, // вотч позволяет следить за изменениями внутри обьекта, immediate и при загрузке отрабатывает(по дефолту только при изменениях)
      deep: true //это значит что я хочу отслеживать даже внутренние изменения и реагировать на них
    }
  },
  methods: {
    ...mapActions("movies", ["changeCurrentPage"]), //вызов из сторы actions
    onChengePoster(poster) {
      //получаю адрес картинки poster
      this.posterBg = poster; //изначально пустой posterBg в data буду переопределять и подставлять в poster
    },
    //*то есть я вотчу за изменениями $route.query, разбираю query и получаю page(по дефолту 1 стр.) и set-чу значение если нужно
    onPageQueryChenge({ page = 1 }) {
      this.changeCurrentPage(Number(page)); //Number потому что возвращает строку
    },
    onPageChanged(page) {
      //подписываюсь на событие и изменяю текущее значение страницы в Сторе
      this.$router.push({ query: { page } }); //при каждом клике при помощи push изменяю location (тоесть адрес page)
      //! this.changeCurrentPage(page);
    }
  }
  //! created() {
  //!   if (this..page) {
  //!     this.changeCurrentPage(Number(this.$route.query.page)); //! когда грузиться компонента(created) проверяю что если есть в query параметрах page, то сразу делаю changeCurrentPage на эту страницу
  //!   }
  //!}
};
</script>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative; /*позиционирование относительно контейнера( а не окна) в данной случае для PosterBg*/
  min-height: 100vh; /*при загрузке контейнет будет во все окно*/
  display: flex; /*весь вложенный контент flex(для пагинации снизу при загрузке)*/
  flex-direction: column; /*(для пагинации снизу при загрузке)*/
}
</style>
