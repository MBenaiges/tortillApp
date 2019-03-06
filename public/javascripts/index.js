'use strict';

const main = () => {
  const formElement = document.querySelector('form#search-tortilla');
  formElement.addEventListener('submit', handleFormSubmit);

  function handleFormSubmit (event) {
    event.preventDefault();
    const inputElement = event.target.querySelector('input');
    const inputValue = inputElement.value;

    searchTortillas(inputValue);
  }
  const searchTortillas = async (tortillaOwner) => {
    try {
      const tortillasRequest = await fetch(`/api/tortillas?username=${tortillaOwner}`);
      if (tortillasRequest.status === 404) {
        // DOM
        document.getElementById('results').innerText = `User dont exist`;
      }
      const tortillas = await tortillasRequest.json();
      // DOM
      tortillas.forEach(tortilla => {
        const results = document.getElementById('results');
        let tortillaList = document.createElement('li');
        tortillaList.innerText = tortilla.name;
        results.appendChild(tortillaList);
      });
    } catch (error) {
      console.error(error);
    }
  };
};

window.addEventListener('load', main);
