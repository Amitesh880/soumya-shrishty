import React, { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const GeoCoderMarker = ({ address }) => {
  const map = useMap();
  const [position, setPosition] = useState([20.5937, 78.9629]); // Default to India

  useEffect(() => {
    if (!address || address.trim().length < 3) return;

    ELG.geocode().text(address).run((err, results) => {
      if (err) {
        console.error("Geocoding error:", err);
        return;
      }

      if (results?.results?.length > 0) {
        const { lat, lng } = results.results[0].latlng;
        setPosition([lat, lng]);
        map.flyTo([lat, lng], 10);
      } else {
        console.warn("No geocoding results for:", address);
      }
    });
  }, [address, map]);

  return (
    <Marker position={position}>
      <Popup>{address}</Popup>
    </Marker>
  );
};

export default GeoCoderMarker;