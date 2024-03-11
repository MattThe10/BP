



const results_div = document.querySelector('.results-div');
const submit_btn = document.getElementById('submit-btn');
let inp = document.getElementById('inp');
const err_mess = document.getElementById('err-mess');
const airport_par = document.getElementById('airport');
const time_par = document.getElementById('time');
const wind_speed_par = document.getElementById('wind-speed');
const wind_direction_par = document.getElementById('wind-direction');
const temp_par = document.getElementById('temp');
const vis_par = document.getElementById('visibility');
const lang_inp = document.getElementById('lang-inp');
const pressure_par = document.getElementById('pressure')
const cloudiness_par = document.getElementById('cloudiness')
let lang = 1; //1 je slovenčina, 2 je angličtina

let minus_regex = /M\d\d\/M\d\d/;
let temp_regex = /\d\d\/\d\d/;
let icao_regex = /LZ\w\w/;
let wind_regex = /KT$/;
let wind_var_regex = /\d\d\dV\d\d\d/
let time_regex = /.Z/;
let cavok_regex = /CAVOK/;
let vis_regex = /\b\d{4}\b/;
let alt_regex = /Q./i
let cloud_regex = /\b\w{3}\b/
let cloud_number_regex = /\b\w\w\w\d\d\d\b/

//zoznam slovenskych letisk
const slovak_icao = {
    LZKZ: 'Košice',
    LZLU: 'Lučenec',
    LZIB: 'Bratislava',
    LZPP: 'Piešťany',
    LZTT: 'Poprad',
    LZPW: 'Prešov',
    LZSL: 'Sliač',
    LZZI: 'Žilina'
}


//Po kliknutí sa vykoná validácia správy
submit_btn.addEventListener('click', () => {
  let mess = inp.value;
  let val = mess.split(' ');
  lang = lang_inp.value;

  if(val[0].toUpperCase() == 'METAR' || val[0].toUpperCase() == 'TAF'){
    reset();
    updateDisplay(val)
  }

  //Iné prípady sú error
  else {
    if(lang == 1){
      err_mess.textContent = 'Zadajte správny formát!';
    } else {
      err_mess.textContent = 'Wrong format!';
    }
    
  }

})

function updateDisplay(mess) {
  err_mess.textContent = '';
  
  for(let i = 0; i < mess.length; i++){
    if(mess[i].match(temp_regex)){
      getTemperature(mess[i]);
    }
    
    if(mess[i].match(minus_regex)){
      getMinusTemperature(mess[i]);
    }

    if(mess[i].match(icao_regex)){
      getAirport(mess[i]);
    } 

    if(mess[i].match(time_regex)){
      getTime(mess[i]);
    } 

    if(mess[i].match(wind_regex)){
      getWind(mess[i]);
    }

    if(mess[i].match(wind_var_regex)){
      getWindDirectionVariability(mess[i])
    }
    
    if(mess[i].match(vis_regex) || mess[i].match(cavok_regex)){
      if(mess[i] == 'CAVOK') {
        if(lang == 1){
          vis_par.textContent = 'Dobrá viditeľnosť';
        } else {
          vis_par.textContent = 'Great visibility';
        }
      } else {
        vis_par.textContent = mess[i];
        console.log(mess[i]);
      }
      
    }

    if(mess[i].match(alt_regex)){
      getAltimeter(mess[i])
    }

    if(mess[i].match(cloud_regex) || mess[i].match(cloud_number_regex)){
      getCloudiness(mess[i])
    }

  }
}

//Vratenie stránky do pôvodného stavu
function reset(){
  inp.value = '';
  err_mess.textContent = ''
  airport_par.textContent = ''
  time_par.textContent = ''
  wind_speed_par.textContent = ''
  wind_direction_par.textContent = ''
  temp_par.textContent =''
  vis_par.textContent= ''
  lang_inp.textContent = ''


}

function getAirport(air){
  for (let airport in slovak_icao){
    if(air == airport){
      airport_par.textContent =  `Letisko ${slovak_icao[airport]}`;
    }
  }
}

function getTime(time) {
  let reg = /.{1,2}/g;
  let arr = time.match(reg);
    time_par.textContent =  `Merané v čase ${arr[1]}:${arr[2]}`;
}

function getWind(wind){
  let speed = wind.substring(wind.length, 3);
  let direction = wind.substring(0,3);
  let toKmH = parseFloat(speed, 10) * 1.852;

  wind_speed_par.textContent = ` Rýchlosť vetra je ${Math.floor(toKmH)} Km/h a\n
                                 Smer vetra v stupňoch je ${direction}`;
  
}

function getWindDirectionVariability(direction) {
  let from = direction.substring(0,3);
  let to = direction.substring(4,8);
  wind_direction_par.textContent = `Smer vetra je v rozmedzí od ${from} do ${to}`
  console.log(from, to);
}

function getTemperature(temp){
  if(temp.match(temp_regex)){
    if(temp.split('')[0] == 'M'){
      let temperature = temp.substring(2,3);
    temp_par.textContent = `Teplota je -${temperature}°C`;
    console.log('2');
    }
    else {
      if(temp.split('')[0] == '0'){
        temperature = temp.substring(1,2);
        let dewpoint = temp.substring(3,5);
        temp_par.textContent = `Teplota je ${temperature}°C`;
      } else {
        temperature = temp.substring(0,2);
      let dewpoint = temp.substring(3,5);
      temp_par.textContent = `Teplota je ${temperature}°C`;
      }
      
    }
    
  }
  
}

function getMinusTemperature(temp){
  let temperature;
  if(temp.split('')[1] == '0'){
    temperature = temp.substring(2,3);
  } else {
    temperature = temp.substring(1,3);
  }
  
  temp_par.textContent = `Teplota je -${temperature}°C`;
}

function getAltimeter(alt) {
  let altimeter = alt.split('');
  altimeter.shift();
  pressure_par.textContent = altimeter.join('')
}

function getCloudiness(mess) {
  let x = ''
  let str = ''
  if(mess.length == 6) {str = mess.substring(0,3); console.log(str);}
  else {str = mess}
  
    switch(str.toUpperCase()) {
      case 'SKC':  if(lang == 1) x = 'Žiadna Oblačnosť'
                   else x = 'Sky Clear'; break;
      case 'FEW':  if(lang == 1) x = 'Malá oblačnosť'
                   else x = 'Few clouds'; break; 
      case 'SCT':  if(lang == 1) x = 'Polooblačno'
                   else x = 'Scattered Skies'; break;  
      case 'BKN':  if(lang == 1) x = 'Oblačno'
                   else x = 'Broken Skies'; break;   
      case 'OVC':  if(lang == 1) x = 'Zamračené'
                   else x = 'Overcast'; break;  
    }

    cloudiness_par.textContent = x;
  } 
  

  









 


