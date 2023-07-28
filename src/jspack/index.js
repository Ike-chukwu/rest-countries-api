const searchBtn = document.querySelector('.fa-search')
const InputFieldContainer = document.querySelector('.input')
const InputField = document.querySelector('input')
const chevronDownArrow = document.querySelector('.fa-chevron-down')
const dropDownMenu = document.querySelector('.drop-down')
const dropDownMenuItems = document.querySelectorAll('.drop-down p')
const label = document.querySelector('.label p')
const filterLabel = document.querySelector('.label')
const moon = document.querySelector('.fa-moon')
const weather = document.querySelector('.weather')
const nav = document.querySelector('nav')
const boxes = document.querySelectorAll('.container .box')
const container = document.querySelector('.container ')
const loader = document.querySelector('.loader')
chevronDownArrow.addEventListener('click', function(){
    dropDownMenu.classList.toggle('active')
})



// ----lightmode variable checker--
let mode;
if(localStorage.getItem('weather') == 'sun'){
    document.body.classList.toggle('active')
    moon.classList.toggle('fa-sun')
    InputFieldContainer.classList.toggle('lightmode')
    dropDownMenu.classList.toggle('lightmode')
    filterLabel.classList.toggle('lightmode')
    nav.classList.toggle('lightmode')
    InputField.classList.toggle('lightmode')
}
else{
    document.body.classList.remove('active')
    moon.classList.remove('fa-sun')
    InputFieldContainer.classList.remove('lightmode')
    dropDownMenu.classList.remove('lightmode')
    filterLabel.classList.remove('lightmode')
    nav.classList.remove('lightmode')
    InputField.classList.remove('lightmode')
}


// ---lightmode toggler----
moon.addEventListener('click', function(){
    document.body.classList.toggle('active')
    moon.classList.toggle('fa-sun')
    InputFieldContainer.classList.toggle('lightmode')
    dropDownMenu.classList.toggle('lightmode')
    filterLabel.classList.toggle('lightmode')
    nav.classList.toggle('lightmode')
    InputField.classList.toggle('lightmode')
    containerQuery()
    if(filterLabel.classList.contains('lightmode')){
        mode = 'sun'
        localStorage.setItem('weather', mode)
    }
    else{
        mode = 'moon'
        localStorage.setItem('weather', mode)
    }
})


// ----adding lightmode to newly endered boxes/countries---
function containerQuery(){
    const boxes = container.querySelectorAll('.box')
    boxes.forEach(box => {
        box.classList.toggle('lightmode')
    })
}


// ----fetching data---
function fetcher(url){
    fetch(url).then(res => {
        return res.json()
    }
    ).then(data => {
    loader.classList.add('disappear')
    renderData(data)
    })
}
// ---getting data for all the countries from REST api---
fetcher("https://restcountries.com/v2/all")



// -----rendering all countries in api---
function renderData(data){
    let country;
    container.innerHTML = ``
    for (country of data){
        const div = document.createElement('div')
        let popN = country.population.toLocaleString('en-US')
        div.className = 'box'
        if(!country.capital ){
            country.capital = 'Unknown'
            console.log('yes');
        }
        div.innerHTML = `
        <img src=${country.flag} alt="">
        <h3 class="countryActual">${country.name}</h3>
        <div class="details">
        <p class="populaton">Population:${popN}</p>
        <p class="r-gion">Region:${country.region}</p>
        <p class="capital">Capital:${country.capital}</p>
        </div>
        `
        countryClick(div)
        if(country.capital === 'Unknown'){
            div.querySelector('.capital').remove()
        }
        container.appendChild(div)
    }
    if(localStorage.getItem('weather') == 'sun'){
        containerQuery()
    }
}



//---function that runs when any country is clicked 
function countryClick(div){
    div.addEventListener('click', function(){
        const countryName = div.querySelector('.countryActual').textContent
        localStorage.setItem("country", countryName )
        window.location.href = "../page1.html"
    })
}




// ----any clicked region category filters the data on the homepage---
dropDownMenuItems.forEach(item => {
    item.addEventListener('click', function(){
        label.textContent = item.textContent
        if(label.textContent == 'Africa' || label.textContent == 'America' || label.textContent == 'Asia' || label.textContent == 'Europe' || label.textContent == 'Oceania'  ){
            let result = label.textContent
            loader.classList.remove('disappear')
            filterFetcher(`https://restcountries.com/v3.1/region/${result}`)
        }
        else if(label.textContent == 'Any')
        {
            loader.classList.remove('disappear')
            fetcher("https://restcountries.com/v2/all")
        }
    })
})

// ---filtering by region--
function filterFetcher(url){
    fetch(url).then(res => {
        return res.json()
    }
    ).then(data => {
        loader.classList.add('disappear')
        container.innerHTML = ``
        for (country of data){
        const div = document.createElement('div')
        div.className = 'box'
        let popN = country.population.toLocaleString('en-US')
        if(!country.capital ){
            country.capital = 'Unknown'
            console.log('yes');
        }
        div.innerHTML = `
        <img src=${country.flags.png} alt="">
        <h3 class="countryActual">${country.name.common}</h3>
        <div class="details">
            <p class="populaton">Population:${popN}</p>
            <p class="r-gion">Region:${country.region}</p>
            <p class="capital">Capital:${country.capital}</p>
        </div>
        `
        if (nav.classList.contains('lightmode')){
            div.classList.add('lightmode')
        }
        countryClick(div)
        if(country.capital === 'Unknown'){
            div.querySelector('.capital').remove()
        }
        container.appendChild(div)
    }
    })

}





// ---search functionality using the input field---
function searchFetcher(url){
    fetch(url).then(res => {
        return res.json()
    }
    ).then(data => {
    container.innerHTML = ``
    try{
    for (country of data){
        const div = document.createElement('div')
        div.className = 'box'
        let popN = country.population.toLocaleString('en-US')
        if(!country.capital ){
            country.capital = 'Unknown'
            console.log('yes');
        }
        div.innerHTML = `
        <img src=${country.flags.png} alt="">
        <h3 class="countryActual">${country.name.common}</h3>
        <div class="details">
            <p class="populaton">Population:${popN}</p>
            <p class="r-gion">Region:${country.region}</p>
            <p class="capital">Capital:${country.capital}</p>
        </div>
        `
        if(country.capital === 'Unknown'){
            div.querySelector('.capital').remove()
        }
        container.appendChild(div)
        countryClick(div)
    }}
    catch(err){
        const div = document.createElement('div')
        div.classList = 'empty-state'
        div.innerHTML = ` 
        <i class="fas fa-magnifying-glass"></i>
        <div class='error-text'>
        <h3>Sorry! No result found😥</h3>  
        <h1> We cannot find the item you are searching <br/> for,maybe a little spelling mistake? </h1>  
        </div>
        `
        container.appendChild(div)
        if(localStorage.getItem('weather') == 'sun'){
            container.querySelector('.empty-state').classList.add('lightmode')
            container.querySelector('.empty-state i').classList.add('lightmode')
        }
        else{
            container.querySelector('.empty-state').classList.remove('lightmode')
            container.querySelector('.empty-state i').classList.remove('lightmode')
        }
    }
    if(localStorage.getItem('weather') == 'sun'){
        containerQuery()
    }
    })
}


// ---kryup event listener added to input field to pick any letter enetered to it so as to generate the data
InputField.addEventListener('keyup', function(){
    let name = this.value
    searchFetcher(`https://restcountries.com/v3.1/name/${name}`)
    
    if (name === ''){
        loader.classList.remove('disappear')
        fetcher("https://restcountries.com/v2/all")
    }
})


// ----disable region dropdowwn when window has been scrolled down--
window.addEventListener('scroll', function(){
    if(window.scrollY > 120){
        dropDownMenu.classList.remove('active')
    }
})
