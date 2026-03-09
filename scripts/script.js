const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const API_KEY = config.API_KEY;

searchBtn.addEventListener("click", function () {
  const city = cityInput.value;
  fetchWeather(city);
});

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.cod !== "200") {
    document.getElementById("results").innerHTML =
      "<p>City not found. Please try again!</p>";
    return;
  }

  displayWeather(data);
  console.log(data);
}

function displayWeather(data) {
  const results = document.getElementById("results");
  const cityName = document.getElementById("cityName");
  cityName.innerHTML = "";
  results.innerHTML = "";
  

  const city_name = data.city.name;
  const country = data.city.country;
  const forecasts = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00"),
  );
  //////////////////////////////////////////////////

    cityName.innerHTML += `
<h2>${city_name}, ${country}</h2>
`;
 
  //////////////////////////////////////////////////
  forecasts.forEach(function (item) {

    const date = item.dt_txt.split(" ")[0];
    const temp = item.main.temp;
    const description = item.weather[0].description;
    const icon = item.weather[0].icon;

    results.innerHTML += `
      <div class="card">
        <h3 class="date">${date}</h3>
        <img class="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" />
        <p class="temp" >${temp}°C</p>
        <p class="desc">${description}</p>
      </div>
    `;
  });
}


// GLOBE SETUP
const canvas = document.getElementById("globe");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(150, 150);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 3;

// create the sphere
const geometry = new THREE.SphereGeometry(1, 32, 32);
const texture = new THREE.TextureLoader().load(
  "images/texture_earth.jpg"
);
const material = new THREE.MeshPhongMaterial({ map: texture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// add light so it doesn't look flat
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// animation loop
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();