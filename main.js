const _coordinatesApiKey = '46d57d99d13d421c9f11de6bdd53b047';
const _weatherApiKey = 'c760d4fee5b94e0baf7112432241411';



function getUserCoordinates () {
    return new Promise((resolve,reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
        }, (err) => {
            reject(err);
        })
    })
    
}

async function getCity() {
    const city = await getCoordinatesRequest();    
    return  _filterData(city);
}

function _filterData (data) {
    return {
        city: data.results[0].components.city,
        borough: data.results[0].formatted,
    }
}



async function getCoordinatesRequest (key = _coordinatesApiKey) {
    try {
        const {latitude, longitude} = await getUserCoordinates(); 
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${key}`);
        // const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=48.1486%2C17.1077&key=${key}`);

        if (!response.ok) {
            throw new Error();
        }
        
        const result =  await response.json();
        console.log(result)

        
        return result;

        
    } catch (error) {
        throw error;
    }
  
}



async function getTemperatureRequest(key = _weatherApiKey) {
    try {
        const {city, borough} = await getCity();
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`)
        if (!response.ok) {
            throw new Error();
            
        } 

        const result =  await response.json();
        result.borough = borough;

        document.querySelector('.widget').innerHTML = `
        <span class="widget__city">${result.location.name} , ${result.location.country}</span>
        <span class="widget__temperature">${result.current.temp_c}&deg;C / ${result.current.temp_f}&deg;F</span>
        <span class="widget__borough">${borough}</span>
        
        `

       

    } catch (error) {
        if (error.message === 'Failed to fetch') {
            document.querySelector('.widget').innerHTML = 'Something went wrong...'
        } else {
            document.querySelector('.widget').innerHTML = 'Please give access to your geolocation and reload the page'
        }
        console.log(error)
        throw error;
    }
   
}



getTemperatureRequest()






