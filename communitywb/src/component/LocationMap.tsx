import { AimOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input, Slider } from 'antd';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure CSS is loaded
import React, { useEffect, useRef, useState } from 'react';
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { axiosClient } from '../api/axiosClient';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useLocationStore } from '../stores/locationStore';

    interface LocationMapProps {
        isOpen: boolean;
        onClose: () => void;
    }
    
    const LocationMap: React.FC<LocationMapProps> = ({ isOpen, onClose}) => {
    const [address, setAddress] = useState<string>('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const { getCurrentLocation } = useCurrentLocation();
    const { currentLocation, location,setLocation, setRadius } = useLocationStore();

    const [modalRadius, setModalRadius] = useState<number>(500);
    const [modalLocation, setModalLocation] = useState<LatLng | null>(currentLocation);

    const mapRef = useRef<L.Map | null>(null);

    const isSameLocation = (loc1: LatLng, loc2: LatLng, epsilon = 1e-5) => {
        return (
            Math.abs(loc1.lat - loc2.lat) < epsilon &&
            Math.abs(loc1.lng - loc2.lng) < epsilon
        );
    };
    useEffect(() => {
        handleSetCurrentLocation();
    }, []);


    useEffect(() => {
        if (modalLocation) {
            fetchReverseGeocode(modalLocation);
        }
    }, [modalLocation]);

    const handleSetCurrentLocation = async () => {
        const currentLoc = await getCurrentLocation();
        setModalLocation(currentLoc);
    };

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

    const handleAddressChange = async (inputValue: string) => {
    setAddress(inputValue);
    if (inputValue.length > 2) {
        await fetchAddressSuggestions(inputValue);
    } else {
        setSuggestions([]);
    }
    };

    const fetchAddressSuggestions = async (inputValue: string) => {
        if (inputValue.length > 2) {
            try {
            const { data } = await axiosClient.get('https://nominatim.openstreetmap.org/search', {
                params: { q: inputValue, format: 'json', addressdetails: 1 },
            });
            setSuggestions(data.map(({ display_name, lat, lon }: any) => ({
                label: display_name,
                value: display_name,
                lat,
                lon,
            })));
            } catch (error) {
            console.error('Error fetching address suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionSelect = (value: string, option: any) => {
        setAddress(value);
        const newLocation = new LatLng(parseFloat(option.lat), parseFloat(option.lon));
        setModalLocation(newLocation);
    };

    const handleRadiusChange = (value: number) => {
        setModalRadius(value);
    };

    const MapCenter = () => {
        const map = useMap();
        useEffect(() => {
            if (modalLocation) map.setView(modalLocation, 13);
        }, [map]);
        return null;
    };

    const MapReadyHandler = () => {
        const map = useMap();

        useEffect(() => {
            if (isOpen) {
            setTimeout(() => {
                map.invalidateSize(); // Trigger invalidateSize when the map is ready
            }, 200); // Add a slight delay to ensure the map is visible before resizing
            }
        }, [map]);

        return null;
    };

    const handleOnClickSetLocation = () => {
        if(isSameLocation(modalLocation?? new LatLng(0,0), location?? new LatLng(0,0))){
            console.log('Coordinates are approximately the same. Location not updated.');
        }else{
            console.log('Coordinates have changed. Updating location.');
            setLocation(modalLocation?? new LatLng(0,0));

        }
        setRadius(modalRadius);
        onClose();
    }
    

    return (
        modalLocation && (
        <div>
            <AutoComplete
            options={suggestions}
            style={{ width: '100%', marginBottom: '20px' }}
            value={address}
            onSearch={handleAddressChange}
            onSelect={handleSuggestionSelect}
            >
            <Input.Search
                placeholder="Enter address"
                enterButton={<Button icon={<AimOutlined />} onClick={handleSetCurrentLocation} />}
            />
            </AutoComplete>
            <MapContainer center={modalLocation} zoom={13} style={{ height: '500px', marginBottom: '20px' }} ref={mapRef}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                /> 
                <MapReadyHandler />
                <MapCenter/>
                <Circle
                    center={modalLocation}
                    radius={modalRadius}
                    color="blue"
                    fillColor="blue"
                    fillOpacity={0.2}
                />
                <Marker
                    position={modalLocation}
                    draggable={true}
                    eventHandlers={{
                    dragend: async (e) => {
                        const marker = e.target as L.Marker;
                        const newPos = marker.getLatLng();
                        setModalLocation(newPos);
                },}}/>
            </MapContainer>

            <Slider
            min={100}
            max={5000}
            value={modalRadius}
            onChange={handleRadiusChange}
            style={{ marginBottom: '20px' }}
            />
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>Radius: {modalRadius} meters</div>
            <Button type="primary" onClick={handleOnClickSetLocation}>
                Set Location
            </Button>
        </div>
        )
    );
    };

    export default LocationMap;