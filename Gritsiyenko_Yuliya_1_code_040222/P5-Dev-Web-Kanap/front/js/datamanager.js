const server = "http://localhost:3001/api/products/";

let storage = JSON.parse(localStorage.getItem("cart")) || {};

/** fonction asynchronne avec fetch type Get pour obtenir tous les produits disponibles de l'API
 * extrait de produits de base de données API
 * reponse en forme de json
 */
async function getAllProducts() {
    try {
        const response = await fetch(server);
        return await response.json();
    }
    catch (erreur) {
        console.error(erreur)

    }
}


/** fonction pour obtenir l'id du produit dans la barre d'adresse de la page 
 * extrait l'id du produit de la barre d'adresse
 *
 * @return  {String}  l'id du produit
 */
function getProductId() {
    const id = new URL(location.href).searchParams.get("id");
    console.log(id);
    return id;
}

// function async avec fetch get pour obtenir les proprietés d'un produit selon son id de l'Api

async function getProduct(id) {
    try {
        const response = await fetch(server + id)
        const data = await response.json();
        return data;
    }
    catch (erreur) {
        console.error(erreur)
    }
}

/** fonction 
 * ajoute au panier , les conditions
 *
 * @param   {String}  idProduct  la référence du produit
 * @param   {String}  color      la variante couleur
 * @param   {String}  qty        le nombre à ajouter
 *                      
 *
 * @return  {void}               met à jour le contenu du panier
 */
function addToCart(idProduct, color, qty) {
    
    /* S'il n'a pas des produits, donc - vide/false s'il contient des chaines des caractéres/produits - créer, true */

    if (!storage[idProduct]) storage[idProduct] = {};
    //création d'un objet
    if (!storage[idProduct][color]) storage[idProduct][color] = 0;
    // additionne parse la quantité
    storage[idProduct][color] += parseInt(qty);
    // enregistre dans le local storage
    saveLocal();
}

/** fonction pour changer la quantité selon id et couleur 
 * change la quantité dans localStorage
 *
 * @param   {String}  idProduct  la référence du produit
 * @param   {String}  color      la variante couleur
 * @param   {String}  qty        le nombre à ajouter
 *                      
 *
 * @return  {void}               met à jour le contenu du panier
 */
function changeQty(qty, idProduct, color) {
    // parse la quantité selon couleur du produit
    storage[idProduct][color] = parseInt(qty);
    // enregistre les changements dans le local storage
    saveLocal();
}


// 
/** fonction pour supprimer l'article du panier du localStorage
 *
 * @param   {String}  idProduct  la référence du produit
 * @param   {String}  color      la variante couleur
 *
 * @return  {void}               supprime et met à jour le contenu du panier dans localStorage
 */

function deleteFromCart(idProduct, color) {
    // supprime du local storage
    delete storage[idProduct][color];
    // enregistre dans le local storage
    saveLocal();
}

// fonction pour sauvegarder des articles localement

function saveLocal() {
    //JSON.stringify pour convertir Java au format Json
    localStorage.setItem("cart", JSON.stringify(storage));
}


/** fonction préalable à l'envoie Post de la commande
 * permet d'avoir le contenu du storage
 *
 * @return  {Object}  
 */
function getStorage() {
    return storage;
}

/** données du formulaire à envoyer 
 *  Fonction pour envoyer le panier avec des articles + formulaire
 *
 * @param   {Object}  contact
 * 
 * @param   {String}  contact.firstName
 * @param   {String}  contact.lastName
 * @param   {String}  contact.address
 * @param   {String}  contact.city
 * @param   {String}  contact.email
 *
 * @return  {Promise.<void>}      change de page (confirmation) avec le numéro de commande
 */
async function sendOrder(contact) {

    try {
        // données à envoyer
        const dataToSend = {

            // les valeurs du local storage à envoyer
            products: Object.keys(storage),

            // récupération des valeurs du formulaire
            contact

        }
        const response = await fetch(server + "order", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        const content = await response.json();
        console.log(content);
        localStorage.clear();
        storage = {};
        document.location.href = "confirmation.html?id=" + content.orderId;
    }
    catch (err) {
        alert("Problème avec l'envoie : " + err.message);

        console.error(err);
    };
};

export {
    deleteFromCart,
    addToCart,
    changeQty,
    getAllProducts,
    getProduct,
    getProductId,
    getStorage,
    sendOrder,
}
