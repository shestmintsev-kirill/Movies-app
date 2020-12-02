import axios from "axios";
import interceptors from "./interceptors";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL
  //! в моем случае не необходим interseptors, но делаю как в обучении
  // params: {
  //   //query параметры, которые должны передаваться с каждым запросом
  //   apikey: process.env.VUE_APP_API_KEY,
  //   plot: "full", //что бы получать полную информацию о фильме
  // },
});

interceptors(instance);

export default instance;
