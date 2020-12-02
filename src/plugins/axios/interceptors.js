//! в моем случае не нужен, т.к. с API все ок, но делаю как в обучении с помощью интерсептора
function setParams(config) {
  const params = config.params || {};
  config.params = Object.assign(params, {
    apikey: process.env.VUE_APP_API_KEY,
    plot: "full"
  });

  return config;
}

function returnData(res) {
  //интерсептор который работает на response
  return res.data; //вытягиваю только data из ответа сервера
}

export default function(axios) {
  axios.interceptors.request.use(setParams);
  axios.interceptors.response.use(returnData);
}
