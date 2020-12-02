<template>
  <div class="poster-page-bg" :style="posterStyle"></div>
</template>

<script>
export default {
  name: "PosterBg", //компонента для фона при наведении на фильм
  props: {
    poster: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    defaultPosterBg:
      "linear-gradient(45deg, rgb(0, 3, 38) 0%, rgb(82, 15, 117) 100%)"
  }),
  computed: {
    posterStyle() {
      return {
        "background-image": this.posterBg //возвращаю обьект в котором буду использовать "background-image", которую буду подставлять на сам элемент ч-з атрибут :style
      };
    },
    posterBg() {
      return this.poster ? `url(${this.poster})` : this.defaultPosterBg; //формирую текущий BG для компоненты
    }
  }
};
</script>

<style scoped>
.poster-page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  /* background-image: linear-gradient(45deg, rgb(0, 3, 38) 0%, rgb(82, 15, 117) 100%); */
  background-size: cover; /*тоесть будет покрывать*/
  background-position: center;
  transition: all 0.2s ease;
}

.poster-page-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.7;
  background-image: linear-gradient(
    45deg,
    rgb(0, 3, 38) 0%,
    rgb(82, 15, 117) 100%
  );
}
</style>
