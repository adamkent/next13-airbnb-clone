import React, { useState, useEffect } from 'react';
import Select from 'react-select';

declare var google: any;

interface AddressSelectProps {
  value?: any;
  onChange: (value: any) => void;
}

const AddressSelect: React.FC<AddressSelectProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBTZAOm47wyR0wYoHljr58GdAAXRbVhGbo&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleMaps;
      document.body.appendChild(script);
    } else {
      initializeGoogleMaps();
    }
  }, []);

  const initializeGoogleMaps = () => {
    // Google Maps API script is loaded, you can initialize it here if needed.
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    const autocomplete = new google.maps.places.AutocompleteService();

    autocomplete.getPlacePredictions({ input: newValue }, (predictions: any) => {
      if (predictions) {
        const formattedPredictions = predictions.map((prediction: any) => ({
          label: prediction.description,
          value: prediction.place_id,
        }));
        setOptions(formattedPredictions);
      }
    });
  };

  const handleOnChange = (option: any) => {
    if (!option || !option.value) {
      // Handle the case where option or option.value is null or undefined
      return;
    }
  
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: option.value }, (results: any, status: any) => {
      if (status === 'OK') {
        const latlng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
        onChange({
          ...option,
          latlng,
        });
      }
    });
  };

  return (
    <Select
      value={value}
      onChange={handleOnChange}
      onInputChange={handleInputChange}
      options={options}
      isClearable
      placeholder="Search for an address"
    />
  );
};

export default AddressSelect;
