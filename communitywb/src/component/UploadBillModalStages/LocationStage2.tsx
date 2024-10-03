import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure to include Leaflet CSS
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
// Fix missing marker icons
import { AimOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input } from 'antd';
import { axiosClient } from '../../api/axiosClient';
import styles from '../../css/LocationStage2.module.css';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';

interface Stage2Props {
location: LatLng | null;
address: string;
setAddress: (address: string) => void;
setLocation: (position: LatLng) => void;
}


const LocationStage2: React.FC<Stage2Props> = ({ location, address, setLocation, setAddress }) => {

    const [suggestions, setSuggestions] = useState<any[]>([]); // Store address suggestions
    const { getCurrentLocation } = useCurrentLocation();

    const fetchReverseGeocode = async (loc: LatLng) => {
        try {
            const response = await axiosClient.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                lat: loc.lat,
                lon: loc.lng,
                format: 'json',
            },
            });
            if (response.data && response.data.display_name) {
            setAddress(response.data.display_name);
            }
        } catch (error) {
            console.error('Error reverse geocoding location:', error);
        }
        };
    // Fetch current location and set as the map center, then reverse geocode for address
    const handleSetCurrentLocation = async () => {
        console.log('Setting current location');
        const loc = await getCurrentLocation();
        console.log(loc);
        setLocation(loc);
        // Reverse geocode to get address
        try {
            const response = await axiosClient.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                lat: loc.lat,
                lon: loc.lng,
                format: 'json',
            },
            });

            if (response.data && response.data.display_name) {
            setAddress(response.data.display_name); // Set the address based on reverse geocoding
            }
        } catch (error) {
            console.error('Error reverse geocoding location:', error);
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
    const MapCenter = () => {
        const map = useMap(); // Access the map instance
        useEffect(() => {
            if (location) {
            map.setView(location); // Center the map at the new location with zoom level 13
            }
        }, [map]);

        return null;
    };
    const MapReadyHandler = () => {
        const map = useMap();

        useEffect(() => {
            console.log('Invalidating map size');
            setTimeout(() => {
                map.invalidateSize(); // Trigger invalidateSize when the map is ready
            }, 200); // Add a slight delay to ensure the map is visible before resizing
            
        }, [map]);

        return null;
    };

    return (
        <div className={styles.container}>
            {location && (
            <div className={styles.card}>
                <MapContainer 
                    center={location} 
                    zoom={13} 
                    className={styles.map}
                >
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    <MapReadyHandler />
                    {/* Component to center the map based on the location */}
                    <MapCenter />
                    <Marker
                    position={location}
                    draggable={true}
                    eventHandlers={{
                        dragend: async (e) => {
                        const marker = e.target as L.Marker;
                        const newPos = marker.getLatLng();
                        setLocation(newPos);
                        await fetchReverseGeocode(newPos); // Update address after marker is moved
                        },
                    }}
                    />
                </MapContainer>
                <div className={styles.mapControl}>
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
                </div>
            </div>
            )}
        </div>
    );
};

export default LocationStage2;