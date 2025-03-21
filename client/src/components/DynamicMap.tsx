import {useEffect, useState} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DynamicMapProps {
	address: string;
}

const DynamicMap: React.FC<DynamicMapProps> = ({address}) => {
	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);

	useEffect(() => {
		const fetchCoordinates = async () => {
			try {
				// Fetch latitude and longitude using Nominatim API (OpenStreetMap)
				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
						address,
					)}`,
				);
				const data = await response.json();

				// Check if the data is available
				if (data.length > 0) {
					setLatitude(parseFloat(data[0].lat));
					setLongitude(parseFloat(data[0].lon));
				} else {
					console.error("Address not found");
				}
			} catch (error) {
				console.error("Error fetching geolocation:", error);
			}
		};

		if (address) {
			fetchCoordinates();
		}
	}, [address]);

	useEffect(() => {
		if (latitude && longitude) {
			const map = L.map("map").setView([latitude, longitude], 13);

			// Add OpenStreetMap tile layer
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

			// Add marker at the coordinates with a popup
			L.marker([latitude, longitude])
				.addTo(map)
				.bindPopup(`<b>${address}</b>`)
				.openPopup();
		}
	}, [latitude, longitude, address]);

	return <div id='map' className="m-auto"  style={{width: "65%", height: "450px"}}></div>;
};

export default DynamicMap;
