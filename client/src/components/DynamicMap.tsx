import {useEffect, useState} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "./Loading";

interface DynamicMapProps {
	address: string;
}

const DynamicMap: React.FC<DynamicMapProps> = ({address}) => {
	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);
	const [mapLoaded, setMapLoaded] = useState(false);

	useEffect(() => {
		const fetchCoordinates = async () => {
			if (!address) return;

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
					setLatitude(null);
					setLongitude(null);
					setLatitude(parseFloat(data[0].lat));
					setLongitude(parseFloat(data[0].lon));
				} else {
					console.error("Address not found");
				}
			} catch (error) {
				console.error("Error fetching geolocation:", error);
			}
		};

		fetchCoordinates();
	}, [address,latitude,longitude]);

	useEffect(() => {
		if (latitude && longitude && !mapLoaded) {
			const map = L.map("map").setView([latitude, longitude], 13);

			// Add OpenStreetMap tile layer
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

			// Add marker at the coordinates with a popup
			L.marker([latitude, longitude])
				.addTo(map)
				.bindPopup(`<b>${address}</b>`)
				.openPopup();

			// Set mapLoaded to true to avoid re-initializing the map
			setMapLoaded(true);
		}
	}, [latitude, longitude, address, mapLoaded]); // Remove mapLoaded from dependencies

	// Show loading spinner if coordinates are not available yet
	if (!latitude || !longitude) {
		return (
			<div>
				<Loading />
			</div>
		);
	}

	return (
		<div id='map' className='m-auto' style={{width: "100%", height: "450px"}}></div>
	);
};

export default DynamicMap;
