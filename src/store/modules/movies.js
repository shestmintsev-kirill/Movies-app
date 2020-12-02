import axios from "@/plugins/axios";
import IDs from "@/store/mock/imdb_top250";
import mutations from "@/store/mutations";

function serializeResponse(movies) {
  //эта ф-ия приймет массив фильмов от сервера, верну (на каждой итерации acc и 1 movie, исходным значением для reduce будет пустой объект  )
  return movies.reduce((acc, movie) => {
    acc[movie.imdbID] = movie; //в acc записываю movie.imdbID и туда буду записывать сам movie
    return acc; //вызвращаю acc предварительно его наполнив
  }, {});
}

const { MOVIES, CURRENT_PAGE, REMOVE_MOVIE, TOGGLE_SEARCH } = mutations; //деструктурирую mutations и достаю из него нужные свойства и добавляю его в мутации

const moviesStore = {
  namespaced: true,
  state: {
    top250IDs: IDs, //присвоил все id из топа
    moviesPerPage: 12, //12 первый фильмов по id на страницу
    currentPage: 1, //1ая страница
    movies: {}, //movies как пустой обьект и добавляю МУТАЦИЮ для того что бы добавить в state
    isSearch: false //маркер о том, что если будет поиск то будет выведено "Search result" вместо "IMDB Top 250"
  },
  getters: {
    moviesList: ({ movies }) => movies, //принимаю фильмы и возращаю фильмы(для вывода в компоненту)
    slicedIDs: ({ top250IDs }) => (from, to) => top250IDs.slice(from, to), //ф-ия которая принимает 2 аргумента(от, до) и будет возвращать топ250.slice(вырезать)
    currentPage: ({ currentPage }) => currentPage, //ф-ия которая возвращает страницу
    moviesPerPage: ({ moviesPerPage }) => moviesPerPage,
    moviesLength: ({ top250IDs }) => Object.keys(top250IDs).length, //Total я могу получить создав данный гетер, получает список всех movies и мерит их длину что бы получить количество
    isSearch: ({ isSearch }) => isSearch // геттер что бы менять название по поиску вместо IMDB Top 250
  },
  mutations: {
    //[]- это вычисляемые св-ва объекта. и это метод который принимает (state и значение которое будет получать)
    [MOVIES](state, value) {
      state.movies = value; //!таким образом я переопределяю movies в state, а вызывать переопределение буду через fetchMovies() c помощью commit
    },
    [CURRENT_PAGE](state, value) {
      state.currentPage = value; //!таким образом я переопределяю currentPage в state, а вызывать переопределение буду через changeCurrentPage() c помощью commit и dispach
    },
    [REMOVE_MOVIE](state, index) {
      state.top250IDs.splice(index, 1); //!таким образом я переопределяю top250IDs в state, при помощи splice укажу с какого индекса удалить и какой кол-во(1)
    },
    [TOGGLE_SEARCH](state, boolean) {
      state.isSearch = boolean; //!таким образом я переопределяю isSearch в state, и подставлю нужное булевое что бы вывести необходимый текст
    }
  },
  actions: {
    async fetchMovies({ getters, commit, dispatch }) {
      try {
        //запрос на получение фильма, fetchMovies будет вызываться при пагинации, и она должна высчитывать какую часть IDшников нужно запросить у серверов,делаю 2 переменных ниже
        dispatch("toggleLoader", true, { root: true });
        const { currentPage, moviesPerPage, slicedIDs } = getters; //деструктурирую
        const from = currentPage * moviesPerPage - moviesPerPage; //высчитываю с какого начать, например 1*12-12 => значит высчитываю с нуля
        const to = currentPage * moviesPerPage; //высчитываю на каком индексе нужно закончить, например 1*12 => на 12 заканчиваю
        const moviesToFetch = slicedIDs(from, to); //вызвал из Геттера slicedIDs и передал туда "от и до"
        const requests = moviesToFetch.map(id => axios.get(`/?i=${id}`)); //пройдусь map по массиву IDшников и на каджой итерации получу id и вызову axios без await, на выходе получаю 12 promise
        const response = await Promise.all(requests); //создал переменную которая на выходе получает 12 обьектов
        const movies = serializeResponse(response); //передаю массив фильмов от сервера в переменную(затем в ф-ию)
        commit(MOVIES, movies); //! вызываю ф-ию commit (передаю ей название мутации и сами movies)
      } catch (err) {
        console.log(err);
      } finally {
        dispatch("toggleLoader", false, { root: true }); //при окончании запроса  прелодер
      }
    },
    changeCurrentPage({ commit, dispatch }, page) {
      commit(CURRENT_PAGE, page); //! переопределение currentPage из state
      dispatch("fetchMovies"); //! Дизпатчу fetchMovies который высчитает в соответствии с новым currentPage нужный кусок фильмов и сделает по ним запрос
    },
    //*прохожу по списку ID которые доступны, найти нужный ID, узнать его индекс в массиве и после передать в мутации этот индекс, мутация с помощью метода splice() удалит нужный эл., после запрошу получение для всех фильмов для текущей страницы
    removeMovie({ commit, dispatch, state }, id) {
      const index = state.top250IDs.findIndex(item => item === id); //метод findIndex(принимает callback в котором на каждой итерации будет попадать 1 ID и сравниваю что он равен тому id которым передали)
      //если найдется такой фильм(id), то вернется его индекс в массиве, если нет то findIndex вернет -1
      if (index != -1) {
        commit(REMOVE_MOVIE, index); //если -1 то делаю commit, мутация удаляет соответствующий id из массива и после делаю dispatch и вызываю fetchMovies
        dispatch("fetchMovies");
      }
    },
    async searchMovie({ commit, dispatch }, query) {
      try {
        dispatch("toggleLoader", true, { root: true }); //вызов прелодера

        const response = await axios.get(`/?s=${query}`); //get запрос серверу и получаю фильмы где есть такое "слово"

        if (response.Error) {
          throw Error(response.Error); // если в res есть error то throw прекратит работу ф-ии и выпаду в catch
        }

        const movies = serializeResponse(response.Search); //передаю массив фильмов от сервера в переменную(затем в ф-ию)
        commit(MOVIES, movies);
      } catch (err) {
        console.log(err.message); //вытащил из объекта ошибки только текст(для нотификации)
        dispatch(
          "showNotify",
          {
            msg: err.message,
            title: "Error",
            variant: "danger"
          },
          { root: true } //указал что это рутовый экшн
        ); //вызываю showNotify, передаю ему msg, title, variant
      } finally {
        dispatch("toggleLoader", false, { root: true }); //остановка прелодера
      }
    },
    //создал отдельный метод для вывода текста после поиска
    toggleSearchState({ commit }, boolean) {
      commit(TOGGLE_SEARCH, boolean); //затем это Actions импортирую в Header
    }
  }
};

export default moviesStore;
