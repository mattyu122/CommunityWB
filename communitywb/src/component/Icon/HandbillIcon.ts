import L from "leaflet";

export const customIcon = L.icon({
    iconUrl: '/handbillMapIcon.png', // URL to the image in public directory
    iconSize: [32, 32], // Adjust size as needed
    iconAnchor: [16, 32], // Anchor so the icon points at the correct position
    popupAnchor: [0, -32] // Adjust popup position
});


export const enlargedIcon = L.icon({
    iconUrl: '/handbillMapIcon.png',
    iconSize: [48, 48], // Enlarged size for hover
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});