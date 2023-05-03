import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';


const inputEl = document.getElementById('search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;


   
inputEl.addEventListener(
  'input',
  _.debounce(async ev => {
    try {
      const countryName = ev.target.value;

      if (countryName === '') {
        listEl.innerHTML = '';
        infoEl.innerHTML = '';
        return;
      }
      const countries = await fetchCountries(countryName.trim());
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        listEl.innerHTML = countries
          .map(
            country =>
              `<li><p><img width="35" src=${country.flags.svg}> <a class="country-names">${country.name.common}</a></p></li>`
          )
          .join('');
        infoEl.innerHTML = '';
      }
      if (countries.length === 1) {
        listEl.innerHTML = `<li><p><img width="35" src=${countries[0].flags.svg}> <b class="country-name">${countries[0].name.common}</b></p></li>`;
        infoEl.innerHTML = `
               <p> <b>Capital:</b> ${countries[0].capital}</p>
               <p> <b>Population:</b> ${countries[0].population}</p>
               <p> <b>Languages:</b> ${Object.values(
                 countries[0].languages
               ).join(', ')}</p>`;
      }
      console.log(countries);
    } catch (error) {
      Notify.failure('Oops, there is no country with that name');
    }
  }, DEBOUNCE_DELAY)
);


// 