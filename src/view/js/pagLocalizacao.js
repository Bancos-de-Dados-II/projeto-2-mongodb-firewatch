
        // Define o ícone personalizado
        var fireIcon = L.icon({
            iconUrl: '../img/fogo.png', 
            iconSize: [32, 32],      
            iconAnchor: [16, 32],     // Posição do ponto do marcador no ícone
            popupAnchor: [0, -32]     // Localização do popup relativo ao ícone
        });

        // Declarar variáveis globais
        var map;
        var marker, fireMarker;
        let latitudeMarker, longitudemarker

        function success(pos) {
            const { latitude, longitude } = pos.coords;


            if (!map) {
                // Inicializa o mapa apenas uma vez
                map = L.map('map').setView([latitude, longitude], 17);

                // Adiciona o tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Cria o marcador inicial com o ícone personalizado
                marker = L.marker([latitude, longitude]).addTo(map)
                    .bindPopup('Você está aqui!')
                    .openPopup();
                fireMarker = null
                map.on('click', e => {
                    latitudeMarker = e.latlng.lat; //pegando a localização do click
                    longitudemarker = e.latlng.lng;
                    
                    if(!fireMarker){
                        fireMarker = L.marker([latitudeMarker, longitudemarker],{ icon: fireIcon }).addTo(map)
                        .bindPopup('incendio!')
                        .openPopup();
                    }
                    else{
                        fireMarker.setLatLng(e.latlng)
                    }
                });

                document.getElementById('searchButton').addEventListener('click', () => { //buscar a localizção dos inputs no mapaa
                    let lugar = document.getElementById('cidade').value + " " + document.getElementById('rua').value
                    console.log(lugar)
                    fetch(`https://nominatim.openstreetmap.org/search?q=${lugar}&format=json`)
                        .then(response => response.json())
                        .then(data => {
                            let centro = [data[0].lat, data[0].lon];
                            map.panTo(centro);
                        })
                })


            } else {
                // Atualiza a posição do marcador
                marker.setLatLng([latitude, longitude]);
                map.setView([latitude, longitude], 17);
            }
        }

        function error(err) {
            console.error("Erro ao obter localização:", err);
        }

        // Rastreia a posição em tempo real
        navigator.geolocation.watchPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 5000
        });

        // Enviar informações ao servidor
        document.getElementById('enviar').addEventListener('click', () => {
            const cidade = document.getElementById('cidade').value;
            const rua = document.getElementById('rua').value;

            if (latitudeMarker && longitudemarker && cidade && rua) {
                const coordenadas = {
                    latitude: latitudeMarker,
                    longitude: longitudemarker,
                    cidade,
                    rua
                };

                console.log('Salvando coordenadas no localStorage:', coordenadas);
                localStorage.setItem('coordenadas', JSON.stringify(coordenadas));

                alert('Localização salva!');
                window.location.href = 'http://localhost:3000/alertarIncendio.html';
            } else {
                alert('Por favor, preencha todos os campos e selecione uma localização no mapa.');
            }
        });