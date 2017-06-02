// @flow
import { API_URL } from '../config';

export function fetchChangeset(id: number, token: ?string) {
  return fetch(`${API_URL}/changesets/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(res => res.json());
}

export function setHarmful(id: number, token: string, harmful: boolean) {
  return fetch(
    `${API_URL}/changesets/${id}/${harmful ? 'set-harmful' : 'set-good'}/`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Token ${token}` : ''
      }
    }
  ).then(res => {
    if (res.status === 403) {
      throw new Error('Changeset was already checked!');
    }
    if (res.status >= 400 && res.status < 600) {
      throw new Error('Bad response from server. Please reload');
    }
    return res.json();
  });
}

const createForm = (obj: Object) => {
  var formData = new FormData();
  Object.keys(obj).forEach(k => {
    formData.append(k, obj[k]);
  });
  return formData;
};

export function setTag(
  id: number,
  token: string,
  tag: Object,
  remove: boolean = false
) {
  if (Number.isNaN(parseInt(tag.value, 10))) {
    throw new Error('tag is not a valid number');
  }
  return fetch(`${API_URL}/changesets/${id}/tags/${tag.value}/`, {
    method: remove ? 'DELETE' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    },
    body: createForm({
      tag_pk: tag,
      id
    })
  }).then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error(
        'Bad request. Please make sure you are allowed to add tags to this changeset.'
      );
    }
    return res.json();
  });
}