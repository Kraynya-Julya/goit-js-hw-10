import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import countriesInfo from './handlebars/countriesInfo.hbs';
import countriesList from './handlebars/countriesList.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const refs = {
    searchBox: document.querySelector('input#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;
let countryName = '';
refs.searchBox.addEventListener('input', debounce(findCountryName, DEBOUNCE_DELAY));
function findCountryName(e) {
    countryName = e.target.value.trim();
    clearInput();
    fetchCountries(countryName)
        .then(name => {
            let letters = name.length;
            // console.log(letters);
        /* если в массиве больше чем 10 стран, появляется уведомление */
            if (letters > 10) {
                return Notify.info(`Too many matches found. Please enter a more specific name`);
            }
        /* если в массиве от 2-х до 10-х стран, отображаем список найденных стран */
            else if (letters >= 2 && letters <= 10) {
                renderCountriesList(name);
            }
        /* если массив с 1 страной, то отображаются данные этой страны */
            else if (letters === 1) {
                 renderCountriesInfo(name);
            }
        })
        .catch(onFetchError);
}
function onFetchError(error) {
    console.log(error);
    if (countryName !== '') {
        Notify.failure(`Oops, there is no country with that name`);
    }
}
function clearInput() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}
function renderCountriesInfo(name) {
    refs.countryInfo.insertAdjacentHTML('beforeend', countriesInfo(name));
}
function renderCountriesList(name) {
    refs.countryList.insertAdjacentHTML('beforeend', countriesList(name));
}