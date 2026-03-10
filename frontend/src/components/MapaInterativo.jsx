import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { CATEGORIAS } from '../constants';
import StarRating from './StarRating';
import { Link } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function getMarkerIcon(nota) {
  const cores = {
    1: '#dc2626',
    2: '#ea580c',
    3: '#d97706',
    4: '#65a30d',
    5: '#16a34a'
  };
  const cor = cores[Math.round(nota)] || cores[3];

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${cor};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">${Math.round(nota)}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
}

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng);
      }
    }
  });
  return null;
}

function UserLocationButton() {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const centralizarUsuario = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 15);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        console.warn('Geolocalização indisponível:', err.message);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <button
      onClick={centralizarUsuario}
      disabled={loading}
      className="absolute top-4 right-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 text-sm font-medium text-gray-700 border border-gray-200"
      aria-label="Centralizar na minha localização"
    >
      {loading ? '📍 Localizando...' : '📍 Minha Localização'}
    </button>
  );
}

export default function MapaInterativo({ locais = [], onLocationSelect, marcadorSelecionado, centroInicial }) {
  const [centro, setCentro] = useState(centroInicial || [-23.5505, -46.6333]);

  useEffect(() => {
    if (!centroInicial) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCentro([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Geolocalização indisponível:', err.message)
      );
    }
  }, [centroInicial]);

  return (
    <div className="relative w-full h-full" role="application" aria-label="Mapa interativo de acessibilidade">
      <MapContainer center={centro} zoom={13} className="h-full w-full rounded-xl">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UserLocationButton />
        {onLocationSelect && <LocationPicker onLocationSelect={onLocationSelect} />}

        {marcadorSelecionado && (
          <Marker position={[marcadorSelecionado.lat, marcadorSelecionado.lng]}>
            <Popup>
              <p className="font-medium text-sm">📍 Local selecionado</p>
              <p className="text-xs text-gray-500">
                {marcadorSelecionado.lat.toFixed(6)}, {marcadorSelecionado.lng.toFixed(6)}
              </p>
            </Popup>
          </Marker>
        )}

        {locais.map((local) => (
          <Marker
            key={local._id}
            position={[local.coordenadas.lat, local.coordenadas.lng]}
            icon={getMarkerIcon(local.notaAcessibilidade)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-1 mb-1">
                  <span aria-hidden="true">{CATEGORIAS[local.categoria]?.emoji}</span>
                  <h3 className="font-bold text-sm">{local.nome}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-1">{local.endereco}</p>
                <div className="mb-2">
                  <StarRating nota={local.notaAcessibilidade} somenteLeitura tamanho="text-sm" />
                </div>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{local.descricao}</p>
                <Link
                  to={`/local/${local._id}`}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Ver detalhes →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
