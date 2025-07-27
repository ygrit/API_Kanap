import {getAllProducts} from "./datamanager.js";


// altTxt: "Photo d'un canapé bleu, deux places"
// colors: (3) ['Blue', 'White', 'Black']
// description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
// imageUrl: "http://localhost:3000/images/kanap01.jpeg"
// name: "Kanap Sinopé"
// price: 1849
// _id: "107fb5b75607497b96722bda5b504926"

/* la mise en forme de texte dans le format Html*/
function templateProduit(specsProduit){
    return /*html*/ `
    <a href="./product.html?id=${specsProduit._id}">
    <article>
      <img src="${specsProduit.imageUrl}" alt="${specsProduit.altTxt}">
      <h3 class="productName">${specsProduit.name}</h3>
      <p class="productDescription">${specsProduit.description}</p>
    </article>
  </a>
 `;
 
}
/** affichage de la page index dans un format html avec l'application de fonction pour insérer les données des produits sur la page index.html
 * utilisation de fonction getAllProducts de datamanager.js pour obtenir les données de l'Api
 * 

*/
async function showPage(){
    let html  = "";
    const products = await getAllProducts();
    //méthode forEach permet executer une fonctionne pour chaque élément du tableau array
    products.forEach(produit => {
        html += templateProduit(produit);
    });
    document.getElementById("items").innerHTML = html;
}

showPage();
