// @ts-nocheck
import { cloneTemplate, createElement } from "../functions/dom.js";

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */

export class TodoList {
  /** @type {Todo[]} */
  #todos = [];

  /** @type {HTMLUListElement} */
  #listElement;

  /**
   * 
   * @param {Todo[]} todos 
   */
  constructor(todos) {
    this.#todos = todos;
  }

  /**
   * 
   * @param {HTMLElement} element 
   */
  appendTo(element) {
    element.append(
      // @ts-ignore
      cloneTemplate('todolist-layout')
    );

    // @ts-ignore
    this.#listElement = element.querySelector('.list-group');

    for(let todo of this.#todos){
      const t = new TodoListItem(todo);
      // @ts-ignore
      this.#listElement.append(t.element);
    }

    element.querySelector('form')?.addEventListener('submit', e => this.#onSubmit(e))
    element.querySelectorAll('.btn-group button').forEach(button => {
      // @ts-ignore
      button.addEventListener('click', e => this.#toggleFilter(e));
    });

    this.#listElement.addEventListener('delete', ({detail: todo}) => {
      this.#todos = this.#todos.filter(t => t !== todo);
      this.#onUpdate();
    })

    this.#listElement.addEventListener('toggle', ({detail: todo}) => {
      todo.completed = !todo.completed;
      this.#onUpdate();
    })
  }

  /**
   * 
   * @param {SubmitEvent} e 
   */
  #onSubmit(e){
    const form = e.currentTarget;
    e.preventDefault();
    // @ts-ignore
    const title = new FormData(form).get('title')?.toString().trim();
    if(title === ''){
      return ;
    }

    const todo = {
      id: Date.now(),
      title,
      completed: false
    }

    // @ts-ignore
    const item = new TodoListItem(todo);
    this.#listElement.prepend(item.element);

    this.#todos.push(todo);
    this.#onUpdate();
    // @ts-ignore
    form.reset();
  }

  #onUpdate(){
    localStorage.setItem('todos', JSON.stringify(this.#todos));
  }

  /**
   * 
   * @param {PointerEvent} e 
   */
  #toggleFilter(e){
    e.preventDefault();
    // @ts-ignore
    const filter = e.currentTarget.getAttribute('data-filter');
    // @ts-ignore
    e.currentTarget.parentElement.querySelector('.active').classList.remove('active');
    // @ts-ignore
    e.currentTarget.classList.add('active');

    if(filter === 'todo'){
      this.#listElement.classList.add('hide-completed');
      this.#listElement.classList.remove('hide-todo');
    }else if(filter === 'done'){
      this.#listElement.classList.add('hide-todo');
      this.#listElement.classList.remove('hide-completed');
    }else{
      this.#listElement.classList.remove('hide-todo');
      this.#listElement.classList.remove('hide-completed');
    }
    
  }
}

class TodoListItem {

  #element;
  #todo;
  /**
   * 
   * @param {Todo} todo 
   */
  constructor(todo) {
    this.#todo = todo;
    const id = `todo-${todo.id}`;
    const li = cloneTemplate('todolist-item').firstElementChild;
    this.#element = li;

    const checkbox = li?.querySelector('input');
    checkbox?.setAttribute('id', id);
    if(todo.completed){
      checkbox?.setAttribute('checked', '')
    };

    const label = li?.querySelector('label');
    label?.setAttribute('for', id);
    // @ts-ignore
    label.innerText = todo.title;

    const button = li?.querySelector('button');
    

    // @ts-ignore
    this.toggle(checkbox);

    button?.addEventListener('click', e => this.remove(e));

    // @ts-ignore
    checkbox.addEventListener('change', e => this.toggle(e.currentTarget));

    this.#element?.addEventListener('delete', e => {
    });

  }

  /**
   * 
   * @return {HTMLElement} 
   */
  get element (){
    // @ts-ignore
    return this.#element;
  }

  /**
   * 
   * @param {MouseEvent} e 
   */
  remove(e){
    e.preventDefault();
    const event = new CustomEvent('delete',{
      detail: this.#todo,
      bubbles: true,
      cancelable: true
    });
    this.#element?.dispatchEvent(event);
    if(event.defaultPrevented){
      return;
    }
    this.#element?.remove();
  }

  /**
   * change l'etat (a faire / faire) de la tache
   * @param {HTMLInputElement} checkbox 
   */
  toggle(checkbox){
    if(checkbox.checked){
      this.#element?.classList.add('is-completed');
    }else{
      this.#element?.classList.remove('is-completed');
    }
    const event = new CustomEvent('toggle',{
      detail: this.#todo,
      bubbles: true,
    });
    this.#element.dispatchEvent(event);
  }
}
