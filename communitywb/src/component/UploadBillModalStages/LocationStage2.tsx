import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure to include Leaflet CSS
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
// Fix missing marker icons
import { AimOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input } from 'antd';
import markerIconRetinaPng from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import { axiosClient } from '../../api/axiosClient';
import styles from '../../css/LocationStage2.module.css';
// Define the icon
const DefaultIcon = L.icon({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIconRetinaPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Stage2Props {
location: LatLng | null;
address: string;
setAddress: (address: string) => void;
setLocation: (position: LatLng) => void;
}


const LocationStage2: React.FC<Stage2Props> = ({ location, address, setLocation, setAddress }) => {

    const [suggestions, setSuggestions] = useState<any[]>([]); // Store address suggestions

    // Fetch current location and set as the map center, then reverse geocode for address
    const handleSetCurrentLocation = () => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
            const { latitude, longitude } = position.coords;
            const currentLocation = new LatLng(latitude, longitude); // Create a LatLng object
            setLocation(currentLocation); // Set current location on the map

            // Reverse geocode to get address
            try {
                const response = await axiosClient.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    format: 'json',
                },
                });

                if (response.data && response.data.display_name) {
                setAddress(response.data.display_name); // Set the address based on reverse geocoding
                }
            } catch (error) {
                console.error('Error reverse geocoding location:', error);
            }
            },
            (error) => {
            console.error('Error fetching current location:', error);
            }
        );
        }
    };
        
    const fetchAddressSuggestions = async (inputAddress: string) => {
        try {
            const response = await axiosClient.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: inputAddress,
                format: 'json',
                addressdetails: 1,
            },
            });

            if (response.data.length > 0) {
                setSuggestions(response.data.map((item: any) => ({
                    label: item.display_name,
                    value: item.display_name,
                    lat: item.lat,
                    lon: item.lon,
                    })));
            } else {
            setSuggestions([]); // Clear suggestions if no results
            }
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
        }
    };

    // Handle address input change and fetch suggestions
    const handleAddressChange = async (inputValue: string) => {
        setAddress(inputValue);
        if (inputValue.length > 2) {
            await fetchAddressSuggestions(inputValue);
        } else {
        setSuggestions([]);
        }
    };

    // Handle address selection
    const handleSuggestionSelect = (value: string, option: any) => {
        setAddress(value);
        const newLocation = new LatLng(parseFloat(option.lat), parseFloat(option.lon)); // Create a LatLng object
        setLocation(newLocation); // Update map location
    };

    // Component to center the map at the new location
    const MapCenter: React.FC<{ location: LatLng }> = ({ location }) => {
        const map = useMap(); // Access the map instance
        useEffect(() => {
            if (location) {
            map.setView(location); // Center the map at the new location with zoom level 13
            }
        }, [location, map]);

        return null;
    };


    return (
    <div className={styles.container}>
        <h1>Select Handbill Location on Map</h1>
        {location && (
        <div className={styles.card}>
            <MapContainer 
                center={location} 
                zoom={13} 
                style={{ height: '600px', width: '70%' }} 
            >
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                />
                {/* Component to center the map based on the location */}
                <MapCenter location={location} />
                <Marker
                position={location}
                draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                    const marker = e.target as L.Marker;
                    const newPos = marker.getLatLng();
                    setLocation(newPos); // Update position
                    },
                }}
                />
                {/* <Circle center={location} radius={radius} /> */}
            </MapContainer>
            <div className={styles.mapControl}>
                {/* Ant Design AutoComplete Component */}
                <AutoComplete
                options={suggestions}
                style={{ width: '100%' }}
                value={address}
                onSearch={handleAddressChange}
                onSelect={handleSuggestionSelect}
                >
                <Input.Search
                placeholder="Enter address"
                enterButton={
                    <Button icon={<AimOutlined />} onClick={handleSetCurrentLocation}/>
                }
                />
                </AutoComplete>
                {/* <label htmlFor="radius">Radius: {radius} meters</label> */}
                {/* <input
                type="range"
                value={radius}
                min={100}
                max={5000}
                step={10}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                placeholder="Radius in meters"
                /> */}
            </div>
        </div>
        )}
    </div>
    );
};

export default LocationStage2;