
import MockAdapter from 'axios-mock-adapter';
import { createAPI } from '../services/api';
import { ActionType } from './action';
import { checkAuth, login, systemLogout, fetchFilmsList, fetchPromoFilm, fetchFavoriteFilmsList, fetchFilmInfo, fetchSimilarFilms, fetchReviews, postComment, updateIsFavoriteStatus } from './api-actions';
import { adaptFilmsToClient, adaptFilmToClient, adaptReviewsToClient } from '../services/adaptors';
import { APIRoute, AuthorizationStatus } from '../const';


let api = null;

const filmData = {
  'id': 1,
  'name': 'The Grand Budapest Hotel',
  'poster_image': 'img/the-grand-budapest-hotel-poster.jpg',
  'preview_image': 'img/the-grand-budapest-hotel.jpg',
  'background_image': 'img/the-grand-budapest-hotel-bg.jpg',
  'background_color': '#ffffff',
  'video_link': 'https://some-link',
  'preview_video_link': 'https://some-link',
  'description': 'In the 1930s, the Grand Budapest Hotel is a popular European ski resort, presided over by concierge Gustave H. (Ralph Fiennes). Zero, a junior lobby boy, becomes Gustaves friend and protege.',
  'rating': 8.9,
  'scores_count': 240,
  'director': 'Wes Andreson',
  'starring': ['Bill Murray', 'Edward Norton', 'Jude Law', 'Willem Dafoe', 'Saoirse Ronan'],
  'run_time': 99,
  'genre': 'Comedy',
  'released': 2014,
  'is_favorite': false,
};

const reviewData = {
  'id': 1,
  'user': {
    'id': 4,
    'name': 'Kate Muir',
  },
  'rating': 8.9,
  'comment': 'Discerning travellers and Wes Anderson fans will luxuriate in the glorious Mittel-European kitsch of one of the directors funniest and most exquisitely designed movies in years.',
  'date': '2019-05-08T14:13:56.569Z',
};

const reviewPostData = {
  'rating': 8,
  'comment': 'Discerning travellers and Wes Anderson fans will luxuriate in the glorious Mittel-European kitsch of one of the directors funniest and most exquisitely designed movies in years.',
};

describe('Async operations', () => {
  beforeAll(() => {
    api = createAPI(() => { });
  });

  it('should make a correct API call to GET /login', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const checkAuthLoader = checkAuth();

    apiMock
      .onGet(APIRoute.LOGIN)
      .reply(200, [{ fake: true }]);

    return checkAuthLoader(dispatch, () => { }, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.REQUIRED_AUTHORIZATION,
          payload: {
            authStatus: AuthorizationStatus.AUTH,
            authInfo: [{ fake: true }],
          },
        });
      });
  });


  it('should make a correct API call to POST /login', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const fakeUser = {email: 'a@test.ru', password: 'qwerty'};
    const loginLoader = login(fakeUser);

    apiMock
      .onPost(APIRoute.LOGIN)
      .reply(200, [{fake: true}]);

    return loginLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);

        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.REQUIRED_AUTHORIZATION,
          payload: {
            authStatus: AuthorizationStatus.AUTH,
            authInfo: [{ fake: true }],
          },
        });
      });
  });


  it('should make a correct API call to DELETE /logout', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const logoutLoader = systemLogout();

    apiMock
      .onDelete(APIRoute.LOGOUT)
      .reply(204);

    return logoutLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);

        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.LOGOUT,
        });
      });
  });


  it('should make a correct API call to GET /films', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const filmsLoader = fetchFilmsList();

    apiMock
      .onGet(APIRoute.FILMS)
      .reply(200, [filmData, filmData]);

    return filmsLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.LOAD_FILMS,
          payload: adaptFilmsToClient([filmData, filmData]),
        });
      });
  });


  it('should make a correct API call to GET /promo', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const promoLoader = fetchPromoFilm();

    apiMock
      .onGet(APIRoute.PROMO_FILM)
      .reply(200, filmData);

    return promoLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.LOAD_PROMO_FILM,
          payload: adaptFilmToClient(filmData),
        });
      });
  });


  it('should make a correct API call to GET /favorite', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const favoriteLoader = fetchFavoriteFilmsList();

    apiMock
      .onGet(APIRoute.FAVORITE_FILMS)
      .reply(200, [filmData, filmData]);

    return favoriteLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.LOAD_FAVORITE_FILMS,
          payload: adaptFilmsToClient([filmData, filmData]),
        });
      });
  });


  it('should make a correct API call to GET /films/: id', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const filmId = 1;
    const filmLoader = fetchFilmInfo(filmId);

    apiMock
      .onGet(`${APIRoute.FILMS}/${filmId}`)
      .reply(200, filmData);

    return filmLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.LOAD_FILM,
          payload: adaptFilmToClient(filmData),
        });
      });
  });


  it('should make a correct API call to GET /films/: id/similar', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const filmId = 1;
    const similarFilmsLoader = fetchSimilarFilms(filmId);

    apiMock
      .onGet(`${APIRoute.FILMS}/${filmId}/similar`)
      .reply(200, [{...filmData, id: 2}, {...filmData, id: 3}]);

    return similarFilmsLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.LOAD_SIMILAR_FILMS,
          payload: adaptFilmsToClient([{...filmData, id: 2}, {...filmData, id: 3}]),
        });
      });
  });


  it('should make a correct API call to GET /comments/: film_id', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const filmId = 1;
    const reviewsLoader = fetchReviews(filmId);

    apiMock
      .onGet(`${APIRoute.REVIEWS}/${filmId}`)
      .reply(200, [reviewData, reviewData]);

    return reviewsLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.LOAD_REVIEWS,
          payload: adaptReviewsToClient([reviewData, reviewData]),
        });
      });
  });


  it('should make a correct API call to POST /comments/: film_id', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const filmId = 1;
    const postReviewLoader = postComment(filmId, reviewPostData, () => {});

    apiMock
      .onPost(`${APIRoute.REVIEWS}/${filmId}`)
      .reply(200, [reviewData]);

    return postReviewLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.SET_IS_SENDING,
          payload: false,
        });
      });
  });


  it('should make a correct API call to POST /favorite/: film_id/: status', () => {
    const apiMock = new MockAdapter(api);
    const dispatch = jest.fn();
    const filmId = 1;
    const updateFavoriteLoader = updateIsFavoriteStatus(filmId, true, true, 1);

    apiMock
      .onPost(`${APIRoute.FAVORITE}/${filmId}/1`)
      .reply(200, [filmData]);

    return updateFavoriteLoader(dispatch, () => {}, api)
      .then(() => {
        expect(dispatch).toHaveBeenCalledTimes(2);

        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: ActionType.UPDATE_FILM,
        });

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: ActionType.UPDATE_PROMO_FILM,
        });
      });
  });

});
