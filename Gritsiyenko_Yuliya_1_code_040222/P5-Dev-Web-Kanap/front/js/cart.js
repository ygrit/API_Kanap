// const server = "http://localhost:3001/api/products/${_id}";


import { getStorage, getProduct, changeQty, deleteFromCart, sendOrder} from "./datamanager.js";
exposeElm("onClickDelete", onClickDelete);
exposeElm("updateQty", updateQty);

//  Récuperation des données qté, couleur, description du local storage pour afficher, 

//storage    local storage
const selectedItem = getStorage();
const products = {};

/**
 * Affichage du panier
 *
 * @return  {Promise.<void>}  affiche le contenu du panier
 */
async function basketDisplay() {
  if (selectedItem) {
    // pour les produits du local storage
    for (const key of Object.keys(selectedItem)) {
      // obtenir 1 clé du serveur Api avec l'id de produit
      products[key] = await getProduct(key);
    }

    let html = "";
    let totalQuantity = 0;
    let totalPrice = 0;
    //    si panier est vide - opérer avec le contenu de Local storage
    if (selectedItem === null || Object.keys(selectedItem).length === 0) {
      //pour  afficher msg  'Panier est vide'    s'il y aucun produit
      html = "<h2>Votre panier est vide</h2>";

      //pour le formulaire - de ne pas l'afficher si panier est vide
      const form = document.querySelector(".cart__order");
      form.style = "display:none";
    }
    else {
      
      for (const [key, value] of Object.entries(selectedItem)) {
        for (const [color, qty] of Object.entries(value)) {
          html += productTemplate(products[key], color, qty)
          totalQuantity += qty;
          totalPrice += qty * products[key].price;
        }
      }
    }
    document.getElementById("cart__items").innerHTML = html;
    document.getElementById("totalQuantity").innerText = totalQuantity.toString();
    document.getElementById("totalPrice").innerText = totalPrice.toString();
  }
}
basketDisplay();


/**
 * permet de rendre une fonction accessible depuis window malgré le type module
 *
 * @param   {String}  elmName  le nom de l'élément à exposer
 * @param   {*}  elm      l'element à exposer : méthode, object, etc.
 *
 * @return  {void}
 */
function exposeElm(elmName, elm) {
  window[elmName] = elm;
}

/*----------------- bouton Supprimer l'article ---------------------*/
/**
 * fonction retire un élément du panier avec l'id du produit
 * @param {String} id    l'id du produit à enlever
 * @param {String} color le nom de la variante couleur
 * @returns {void}   met à jour l'affichage
 */
function onClickDelete(id, color) {
  deleteFromCart(id, color);
  basketDisplay();
}

/**
 * met à jour la quantité d'un produit
 *
 * @param {String}  qty  quantité
 * @param {String} id    l'id du produit à enlever
 * @param {String} color le nom de la variante couleur
 *
 * @returns {void}   met à jour l'affichage
 */
function updateQty(qty, id, color) {
  changeQty(qty, id, color);
  basketDisplay();
}

/**
 * fonction génère l'affichage des produits du panier en insérant code html dans le DOM
 *
 * @param   {String}  product  produit
 * @param   {String}  color    couleur
 * @param   {String}  qty      quantité des produits ajoutés
 *
 * @return  {String}           le html d'un élément du panier
 */
function productTemplate(product, color, qty) {
  return ` <article class="cart__item" data-id="${product._id}" data-color="${color}">
  <div class="cart__item__img">
  <img src="${product.imageUrl}" alt="${product.altTxt}"> 
  </div>
  <div class="cart__item__content">
  <div class="cart__item__content__description">
  <h2 class="productName">${product.name}</h2>
  <p>${color} </p>
  <p>${product.price} €</p>
  </div>
  <div class="cart__item__content__settings">
  <div class="cart__item__content__settings__quantity">
  <p>Qté :  
  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${qty}" onchange="updateQty(this.value,'${product._id}', '${color}')">
  </p>
  </div>
  <div class="cart__item__content__settings__delete">
  
  <button class="deleteItem" onclick="onClickDelete('${product._id}', '${color}')">Supprimer</button>
  </div>
  </div>
  </div>
  </article>
  `;
}

// fonction pour ne pas afficher le message si données du formulaire sont valides, à utiliser dans les conditions "else"
function removeMsg(target) {
  target.innerText = "";
  target.style.color = "transparent";
}

//  formulaire   VALIDATION
/**
 * fonction pour valider les entrées des lignes du formulaire avec regExp avec méthode addEventListener
 *
 * @param   {String}  firstName  prénom
 * @param   {String}  lastName   nom
 * @param   {String}  email      l'adresse mail
 * @param   {String}  address    l'adresse
 * @param   {String}  city       l'adress
 * @return  {void}           
 */

const form = document.querySelector("form");

form.addEventListener("change", validForm);

function validForm(e) {
  e.preventDefault();
  e.stopPropagation();
  // validation champs prénom - formulaire
  console.log("change");

  const firstNameInput = document.querySelector("#firstName");
  const nameRegExp = /^[a-zA-Zàâäéèêëïîôöùûüç\-\s]+$/;
  const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  if (!nameRegExp.test(firstNameInput.value) || firstNameInput.value === "") {
    // console.log(firstNameInput.value, nameRegExp.test(firstNameInput.value) , firstNameInput.value === "");
    firstNameErrorMsg.innerHTML = 'Le prénom doit comporter des lettres et des tirets uniquement';
    firstNameErrorMsg.style.color = 'red';
    //e.preventDefault();
    return false;
    
  }
  else {
    removeMsg(firstNameErrorMsg)
    
  };
// contrôle de la validité du nom
  const lastNameInput = document.querySelector("#lastName");
  const lNameRegExp = /^[a-zA-Zàâäéèêëïîôöùûüç\-\s]+$/;
  const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  if (!lNameRegExp.test(lastNameInput.value) || lastNameInput.value === "") {
    lastNameErrorMsg.innerHTML = 'Le nom doit comporter des lettres et des tirets uniquement';
    lastNameErrorMsg.style.color = 'red';
    //e.preventDefault();
    return false;
  }
  else {
    removeMsg(lastNameErrorMsg);
    
  };

  // validation d'adresse mail
  /**
   * @type   {HTMLInputElement}  
   */
  const emailInput = document.querySelector("#email");
  const emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  const emailErrorMsg = document.querySelector("#emailErrorMsg");

  if (!emailRegExp.test(emailInput.value) || emailInput.value === "") {
    emailErrorMsg.innerHTML = 'Veuillez renseigner votre adresse';
    emailErrorMsg.style.color = 'red';
   // e.preventDefault();
    return false;
  }
  else {
    removeMsg(emailErrorMsg);
    
  };

  //validation d'adresse
  const addressInput = document.querySelector("#address");
  const addressRegExp = /^[0-9]{1,3}(?:(?:[,.\s]){1}[-a-zA-Zàâäéèêëïîôöùûüç\s]+)+/;
  
  const addressErrorMsg = document.querySelector("#addressErrorMsg");
  if (!addressRegExp.test(addressInput.value) || addressInput.value === "") {
    addressErrorMsg.innerHTML = 'Veuillez renseigner votre adresse mail'
    addressErrorMsg.style.color = 'red'
    //e.preventDefault();
    return false;
  }
  else {
    removeMsg(addressErrorMsg);
    
  };

  //validation ville
  const cityInput = document.querySelector("#city");
  const cityRegExp = /^[a-zA-Zàâäéèêëïîôöùûüç\-\s]+$/;

  const cityErrorMsg = document.querySelector("#cityErrorMsg");
  if (!cityRegExp.test(cityInput.value) || cityInput.value === "") {
    cityErrorMsg.innerHTML = 'non valid'
    cityErrorMsg.style.color = 'red'
    //e.preventDefault();
    return false;
    
  }
  else {
    removeMsg(cityErrorMsg);
    
  };
  return true;
};

//localisation dans le DOM
const order = document.getElementById("order");
//Ecouter le panier - bouton "submit"
order.addEventListener("click", sendForm);


/** données du formulaire à envoyer 
 * Function pour envoyer le panier avec des articles + formulaire
 *
 * @param   {Event}  event
 *
 * @return  {void}           [return description]
 */
function sendForm(event) {
  event.preventDefault();
  event.stopPropagation();
  if (!validForm(event)) return;
  // formulaire - données à envoyer
  const contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };
  sendOrder(contact)
};