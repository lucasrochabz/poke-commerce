const pokemonList = document.getElementById('pokemonList');
const cart = document.getElementById('cart');
const cartItems = [];

fetchPokemonUrls = async () => {
  try{
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
    if(response.ok) {
      const data = await response.json();
      const pokemonUrls = data.results;
      return data.results.map(pokemon => pokemon.url);
    } else {
      console.error('Erro ao buscar URLs de Pokémon.');
      return [];
    }
  } catch (error) {
    console.log('Erro ao buscar Pokémon: ' + error);
    return [];
  }
}

fetchPokemonDetailsAndCreateListItem = async (pokemonUrl) => {
  try {
    const response = await fetch(pokemonUrl);
    if(response.ok) {
      pokemonData = await response.json();
      const price = Math.floor(Math.random() * 100) + 1;
      const listItem = createPokemonListItem(pokemonData, price);
      pokemonList.appendChild(listItem);
    } else {
      console.error('Erro ao buscar detalhes do Pokémon.');
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do Pokémon: ' + error);
  }
}

listPokemonWithDetails = async () => {
  try {
    const pokemonUrls = await fetchPokemonUrls();
    pokemonList.innerHTML = '';
    for (const pokemonUrl of pokemonUrls) {
      await fetchPokemonDetailsAndCreateListItem(pokemonUrl);
    }
  } catch (error) {
    console.error('Erro ao buscar Pokémon com detalhes: ' + error);
  }
}

createPokemonListItem = (pokemonData, price) => {
  const listItem = document.createElement('li');
  
  const nameElement = createNameElement(pokemonData.name);
  const idElement = createIdElement(pokemonData.id);
  const typesElement = createTypesElement(pokemonData.types);
  const imageElement = createImageElement(pokemonData.sprites.front_default, pokemonData.name);
  const priceElement = createPriceElement(price);
  const addButton = createAddButton(pokemonData.name, price);

  appendElements(listItem, [nameElement, idElement, typesElement, imageElement, priceElement, addButton]);
  
  return listItem;
}

createNameElement = (name) => {
  const nameElement = document.createElement('h2');
  nameElement.innerText = name;
  return nameElement;
}

createIdElement = (id) => {
  const idElement = document.createElement('p');
  idElement.innerText = `ID: ${id}`;
  return idElement;
}

createTypesElement = (types) => {
  const typesElement = document.createElement('p');
  const typesNames = types.map(type => type.type.name).join(', ');
  typesElement.innerText = `Tipos: ${typesNames}`;
  return typesElement;
}

createImageElement = (src, alt) => {
  const imageElement = document.createElement('img');
  imageElement.src = src;
  imageElement.alt = alt;
  return imageElement;
}

createPriceElement = (price) => {
  const priceElement = document.createElement('p');
  priceElement.innerText = `Preço: R$${price}`;
  return priceElement;
}

createAddButton = (pokemonName, price) => {
  const addButton = document.createElement('button');
  addButton.innerText = 'Adicionar ao carrinho';
  addButton.addEventListener('click', () => {
    addToCart(pokemonName, price);
  });
  return addButton;
}

appendElements = (parent, elements) => {
  elements.forEach(element => {
    parent.appendChild(element);
  });
}

addToCart = (pokemonName, price) => {
  const existingItem = cartItems.find(item => item.name === pokemonName);
  if(existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({name: pokemonName, price, quantity: 1});
  }
  upDateCart();
}

upDateCart = () => {
  cart.innerHTML = 'Carrinho de Compras';
  if(cartItems.length === 0) {
    cart.innerHTML += ' - O carrinho está vazio.'
  } else {
    const cartList = document.createElement('ul');
    let total = 0;

    for(const item of cartItems) {
      const cartItem = document.createElement('li');

      const removeButton = document.createElement('button');
      removeButton.innerText = 'Remover';
      removeButton.classList.add('remove-button');
      removeButton.addEventListener('click', () => {
        removeFromCart(item.name);
      });

      const itemInfo = document.createElement('p')
      const name = item.name;
      const price = item.price;
      const quantity = item.quantity;
      const itemTotal = price * quantity;
      itemInfo.innerText = `${name} - R${price} x ${quantity} = R$${itemTotal}`;

      cartItem.appendChild(removeButton);
      cartItem.appendChild(itemInfo);

      cartList.appendChild(cartItem);
      total += itemTotal;
    }

    cart.appendChild(cartList);

    const totalElement = document.createElement('p');
    totalElement.innerText = `Total R$${total}`;
    cart.appendChild(totalElement);

    const clearButton = document.createElement('button');
    clearButton.innerText = 'Limpar Carrinho';
    clearButton.addEventListener('click', clearCart);
    cart.appendChild(clearButton);

    const checkoutButton = document.createElement('button');
    checkoutButton.innerText = 'Finalizar Compra';
    checkoutButton.addEventListener('click', () => {
      finalizePurchase();
      clearCart();
    });
    cart.appendChild(checkoutButton);
  }
}

listPokemonWithDetails();

removeFromCart = (pokemonName) => {
  const existingItem = cartItems.find(item => item.name === pokemonName);
  if(existingItem) {
    existingItem.quantity--;
    if(existingItem.quantity === 0) {
      const index = cartItems.indexOf(existingItem);
      if(index > -1) {
        cartItems.splice(index, 1);
      }
    }
    upDateCart();
  }
}

clearCart = () => {
  cartItems.length = 0;
  upDateCart();
}

finalizePurchase = () => {
  const endMessage = document.createElement('p')
  endMessage.innerText = 'Compra realizada';
  cart.appendChild(endMessage);
};
