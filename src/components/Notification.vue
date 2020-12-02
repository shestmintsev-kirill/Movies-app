<template>
  <div></div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Notification",
  computed: {
    ...mapGetters(["messagePool"])
  },
  watch: {
    messagePool: "showNotification"
  },
  methods: {
    //ф-ия вывода окна Notification(из бутстрапа)
    showNotification({ variant, msg, title }) {
      this.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true
      });
    }
  }
};
</script>

<style scoped></style>
