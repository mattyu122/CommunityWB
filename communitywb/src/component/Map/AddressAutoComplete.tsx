import { AimOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input } from 'antd';
import React, { useState } from 'react';
import { axiosClient } from '../../api/axiosClient';

interface AddressAutoCompleteProps {
address: string;
setAddress: (address: string) => void;
setLocation: (position: { lat: number; lon: number }) => void;
onUseCurrentLocation?: () => void;
}

const AddressAutoComplete: React.FC<AddressAutoCompleteProps> = ({
    address,
    setAddress,
    setLocation,
    onUseCurrentLocation,
}) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const fetchAddressSuggestions = async (inputValue: string) => {
    try {
        const { data } = await axiosClient.get('https://nominatim.openstreetmap.org/search', {
        params: { q: inputValue, format: 'json', namedetails: 1 },
        });
        setSuggestions(
        data.map(({ display_name, lat, lon }: any) => ({
            label: display_name,
            value: display_name,
            lat,
            lon,
        }))
        );
    } catch (error) {
        console.error('Error fetching address suggestions:', error);
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

    const handleSuggestionSelect = (value: string, option: any) => {
    setAddress(value);
    setLocation({ lat: parseFloat(option.lat), lon: parseFloat(option.lon) });
    };

    return (
    <AutoComplete
        options={suggestions}
        value={address}
        onSearch={handleAddressChange}
        onSelect={handleSuggestionSelect}
        style={{ width: '100%' }}
    >
        <Input.Search
        placeholder="Enter address"
        enterButton={<Button icon={<AimOutlined />} onClick={onUseCurrentLocation} />}
        />
    </AutoComplete>
    );
};

export default AddressAutoComplete;