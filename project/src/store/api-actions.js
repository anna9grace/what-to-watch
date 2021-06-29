import {ActionCreator} from './action';
import {APIRoute} from '../const';
import {adaptFilmsToClient, adaptFilmToClient} from '../services/adaptors';

export const fetchFilmsList = () => (dispatch, _getState, api) => (
  api.get(APIRoute.FILMS)
    .then(({data}) => dispatch(ActionCreator.loadFilms(adaptFilmsToClient(data))))
);

export const fetchPromoFilm = () => (dispatch, _getState, api) => (
  api.get(APIRoute.PROMO_FILM)
    .then(({data}) => dispatch(ActionCreator.loadPromoFilm(adaptFilmToClient(data))))
);

export const fetchFavoriteFilmsList = () => (dispatch, _getState, api) => (
  api.get(APIRoute.FAVORITE_FILMS)
    .then(({data}) => dispatch(ActionCreator.loadFavoriteFilms(adaptFilmsToClient(data))))
);