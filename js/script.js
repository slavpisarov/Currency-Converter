import { country_code } from "./country-list.js";

const dropList = document.querySelectorAll(".drop-list select")
const getButton = document.querySelector("form button")
const fromCurrency = document.querySelector(".from select")
const toCurrency = document.querySelector(".to select")

for (let i = 0; i < dropList.length; i++) {

    Object.entries(country_code).forEach(el => {
        const [currency, country] = el;

        let selected;
        if (i == 0) {
            selected = currency == "USD" ? "selected" : "";
        } else if (i == 1) {
            selected = currency == "BGN" ? "selected" : "";
        }

        let optionTag = `<option value="${currency}" ${selected}>${currency}</option>`
        dropList[i].insertAdjacentHTML("beforeend", optionTag)
    });

    dropList[i].addEventListener("change", e => loadFlag(e.target))
}

function loadFlag(el) {
    for (const key in country_code) {
        if (key == el.value) {
            const imgTag = el.parentElement.querySelector("img");
            imgTag.src = `https://flagsapi.com/${country_code[key]}/flat/64.png`
        }
    }
}

window.addEventListener("load", getExchangeRate)

getButton.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate()
})

const exchangeIcon = document.querySelector(".icon")
exchangeIcon.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    loadFlag(fromCurrency)
    loadFlag(toCurrency)
    getExchangeRate()
})

async function getExchangeRate() {
    const text = document.querySelector(".exchange-rate");
    
    const amount = document.querySelector(".amount input")
    let amountVal = amount.value;
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1"
        amountVal = 1;
    }

    const url = `https://v6.exchangerate-api.com/v6/9eb8416ba80379819bb22f32/latest/${fromCurrency.value}`

    try {
        const res = await fetch(url)
        const data = await res.json()
        let exchangeRate = data.conversion_rates[toCurrency.value]
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2)
        text.textContent = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`
    } catch (e) {
        text.textContent = "Something went wrong.."
    }
}