import { addToCart, getProduct, getProductId } from "./datamanager.js";

// produits du local storage
let productData = {};

//function pour afficher l'article choisi sur la page produit selon l'id

async function showArticle() {
    // pour avoir l'id du produit 
    const id = getProductId();
    // pour recevoir les propriétés du produit: titre, description, prix, couleur 
    productData = await getProduct(id);
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const price = document.getElementById("price");
    const select = document.getElementById("colors");

    //pour ajouter l'image
    const imageA = document.querySelector(".item__img");
    imageA.innerHTML = `<img style="display:inline-bloc" src="${productData.imageUrl}"" alt="${productData.altTxt}">`;
    
    title.innerText = `${productData.name}`;
    description.innerText = `${productData.description}`;
    price.innerText = `${productData.price}`;


    showColors(productData.colors);
    console.log(productData);
}

showArticle();


/** function pour ajouter les options des choix de couleurs dans le menu deroulant
 * affiche les differents choix de couleurs
 *
 * @param   {Array}  colors  la liste des couleurs possible
 *
 * @return  {void}           ajoute les couleurs dans le select (DOM)
 */
function showColors(colors) {
    // je choisi mon select
    const select = document.getElementById("colors");
    // je boucle sur les couleurs pour créer les options
    let newOption;
    for (let option of colors) {
        // console.log(option)
        newOption = document.createElement("option");
        newOption.text = option;
        newOption.value = option;
        select.appendChild(newOption);
    }
}


/**
 * fonction pour ajouter un produit selon l'id avec les couleurs et quantité dans le panier en cliquant 
 *
 * @param   {Event}  event  [event description]
 *
 * @return  {void}          appel la fonction d'affichage d'une popup
 */
function onClickAdd(event) {
    /** @type {HTMLSelectElement} */
    const colors = document.querySelector("#colors");

    /** @type {HTMLInputElement} */
    const qty = document.querySelector("#quantity");

    //function des conditions d'ajout au panier dans datamanger
    addToCart(productData._id, colors.value, qty.value);
    
    popupConfirmation(productData.name, colors.value, qty.value);
}

/**
 * fenêtre pop-up pour confirmer que l'article est ajouté dans le panier
 *
 * @param   {String}  name   le nom du produit
 * @param   {String}  color  sa couleur
 * @param   {String}  qty    la quantité à ajouter
 *
 * @return  {void}           affiche une popup
 */
const popupConfirmation = (name, color, qty) => {
    if (window.confirm(`Votre commande de ${name} ${color} ${qty} est ajoutée au panier
  Pour consulter votre panier, cliquez sur OK`)) {
        window.location.href = "cart.html";
    }
}

document.getElementById("addToCart").addEventListener("click", onClickAdd);