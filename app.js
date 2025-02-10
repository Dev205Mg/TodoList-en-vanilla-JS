import {fetchJSON} from './functions/api.js';
import { createElement } from './functions/dom.js';
import {TodoList} from './components/TodoList.js';
try {
  const todos = await fetchJSON('https://jsonplaceholder.typicode.com/todos?_limit=5');
  const list = new TodoList(todos);
  list.appendTo(document.querySelector('#todolist'));
} catch (e) {
  const alert = createElement('div', {
    class: 'alert alert-danger text-center m-2',
    role: 'alert'
  }, "Impossible de charger les elements");
  document.body.prepend(alert);
}