import { AimOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input } from 'antd';
import _debounce from 'lodash/debounce';
import React, { useCallback, useState } from 'react';
import { axiosClient } from '../../api/axios/axiosClient';

interface AddressAutoCompleteProps {
address: string;
setAddress: (address: string) => void;
setLocation: (position: { lat: number; lng: number }) => void;
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
        const { data } = await axiosClient.get('https://api.locationiq.com/v1/autocomplete', {
        params: { q: inputValue, limit: 5 ,key: 'pk.4edbc0256c02c27c211ab930a748dc3e', dedupe:1},
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

    const debouncedFetchSuggestions = useCallback(
        _debounce(fetchAddressSuggestions, 2000),
        []
    )

    const handleAddressChange = async (inputValue: string) => {
        setAddress(inputValue);
        if (inputValue.length > 2) {
            debouncedFetchSuggestions(inputValue);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionSelect = (value: string, option: any) => {
        setAddress(value);
        setLocation({ lat: parseFloat(option.lat), lng: parseFloat(option.lon) });
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