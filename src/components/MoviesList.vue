<template>
  <BContainer>
    <h3 class="list-title">{{ listTitle }}</h3>
    <BRow>
      <template v-if="isExist">
        <BCol lg="3" md="4" cols="6" v-for="(movie, key) in list" :key="key">
          <MovieItem
            :movie="movie"
            @mouseover.native="onMouseOver(movie.Poster)"
            @removeItem="onRemoveItem"
            @showModal="onShowMovieInfo"
          />
          <!-- при наведении на компоненту будет передаваться Poster и перехватываю событие click на remove -->
        </BCol>
      </template>
      <template v-else>
        <div>Empty list</div>
      </template>
    </BRow>
    <BModal
      body-class="movie-modal-body"
      :id="movieInfoModalId"
      size="xl"
      hide-footer
      hide-header
    >
      <MovieInfoModalContent
        :movie="selectedMovie"
        @closeModal="onCloseModal"
      />
    </BModal>
  </BContainer>
</template>

<script>
import MovieItem from "./MovieItem";
import { mapActions, mapGetters } from "vuex";
import MovieInfoModalContent from "./MovieInfoModalContent";

export default {
  name: "MoviesList", // компонента MoviesList будет принимать список фильмов которые будет выводить, отвечает за вывод фильмов
  props: {
    list: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    movieInfoModalId: "movie-info",
    selectedMovieId: ""
  }),
  components: {
    MovieItem,
    MovieInfoModalContent
  },
  computed: {
    ...mapGetters("movies", ["isSearch"]), // импортировал текущий state и получаю текущее булевое isSearch и создаю listTitle()
    isExist() {
      return Boolean(Object.keys(this.list).length); //буду получать ключи из списка(id фильмов), буду узнавать длинну, если 0 то false и тд
    },
    listTitle() {
      return this.isSearch ? "Search result" : "IMDB Top 250"; // возвращает в зависимости от булевого переменной, и это значение подставляю в разметку
    },
    selectedMovie() {
      return this.selectedMovieId ? this.list[this.selectedMovieId] : null; //получаю сам обьект, если есть значение в selectedMovieId, то возвращаю list.обьект. и этот объект selectedMovie реактивно передаю в разметку
    }
  },
  methods: {
    ...mapActions("movies", ["removeMovie"]), //деструктурирую mapActions из сторы и забираю removeMovie
    ...mapActions(["showNotify"]),
    onMouseOver(poster) {
      this.$emit("chengePoster", poster); //будет эмититься событие с Компоненты MovieList. Будет передаваться Poster при наведении на компоненту и я заэмичу его наружу, и в App я подпишусь на это событие
    },
    async onRemoveItem({ id, title }) {
      const isConfirmed = await this.$bvModal.msgBoxConfirm(
        `Are you sure delete ${title}?`
      ); //метод на вызов модального окна при клике на Remove, ответ(true, false)

      if (isConfirmed) {
        this.removeMovie(id); //проверяю, если пользователь подтвердил удаление, то вызываю removeMovie(передавая id который прийдет в этом событии)
        this.showNotify({
          msg: "Movie deleted successful",
          variant: "success",
          title: "Success"
        }); //при удалении фильма буду выдавать Notification
      }
    },
    onShowMovieInfo(id) {
      //метод принимает id того фильма который хочу показать
      this.selectedMovieId = id; //id которое я принимаю ставлю в data selectedMovieId
      this.$bvModal.show(this.movieInfoModalId); //вызов модального окна из бутстрапа(метод бутстрапа) и указывать id модального окна которое есть
    },
    onCloseModal() {
      this.selectedMovieId = null; //при закрытии модального окна selectedMovieId перевожу в null
      this.$bvModal.hide(this.movieInfoModalId); //вызываю у $bvModal hide для того что бы его скрыть
    }
  }
};
</script>

<style scoped>
.list-title {
  font-size: 50px;
  margin-bottom: 30px;
  color: #fff;
}
</style>

<style>
.movie-modal-body {
  padding: 0 !important;
}
</style>
