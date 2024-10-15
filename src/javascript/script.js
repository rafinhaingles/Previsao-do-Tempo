document.querySelector('#search').addEventListener('submit', async (event) => {
  event.preventDefault();

  const cityName = document.querySelector('#city_name').value;
  const selectedDate = document.querySelector('#date').value;

  if (!cityName) {
      document.querySelector("#weather").classList.remove('show');
      showAlert('Você precisa digitar uma cidade...');
      return;
  }

  const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
      const results = await fetch(apiUrl);
      if (!results.ok) throw new Error('Falha na conexão com a API');

      const json = await results.json();

      if (json.cod === "200") {
          // Filtra os dados para encontrar a previsão da data escolhida ou do dia atual
          const filteredData = selectedDate ? json.list.filter(item => {
              const itemDate = new Date(item.dt_txt).toISOString().split('T')[0];
              return itemDate === selectedDate;
          }) : [json.list[0]]; // Se nenhuma data for escolhida, pegar a previsão para agora

          if (filteredData.length > 0) {
              const forecast = filteredData[0];  // Pega a previsão da data
              showInfo({
                  city: json.city.name,
                  country: json.city.country,
                  temp: forecast.main.temp,
                  tempMax: forecast.main.temp_max,
                  tempMin: forecast.main.temp_min,
                  description: forecast.weather[0].description,
                  tempIcon: forecast.weather[0].icon,
                  windSpeed: forecast.wind.speed * 3.6, // Convertendo para km/h
                  humidity: forecast.main.humidity,
              });
          } else {
              showAlert('Não há previsão para a data selecionada.');
          }
      } else {
          throw new Error('Cidade não encontrada');
      }
  } catch (error) {
      document.querySelector("#weather").classList.remove('show');
      showAlert(`
          Não foi possível localizar...

          <img src="src/images/404.svg"/>
          <p>${error.message}</p>
      `);
  }
});

function showInfo(json){
  showAlert('');

  document.querySelector("#weather").classList.add('show');

  document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;

  document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
  document.querySelector('#temp_description').innerHTML = `${json.description}`;
  document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);

  document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
  document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
  document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
  document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)} km/h`; // Agora exibindo em km/h
}

function showAlert(msg) {
  document.querySelector('#alert').innerHTML = msg;
}
