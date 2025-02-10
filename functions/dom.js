/**
 * Fonction qui creer element HTML et ajout ses attributs
 * @param {string} tagName 
 * @param {object} attributes 
 * @return {HTMLElement}
 */
export function createElement(tagName, attributes = {}, text = ''){
  const element = document.createElement(tagName);
  element.innerText = text;
  for(let [attribute, value] of Object.entries(attributes)){
    if(value !== null){
      element.setAttribute(attribute, value);
    }
  }
  return element;
}