import {
    FaHome, FaTree, FaMapMarkerAlt, FaSnowflake,
    FaSun, FaMoon, FaFire, FaWifi,
    FaCoffee, FaCar, FaTv, FaKey,
    FaDoorOpen, FaHeart, FaBed
} from "react-icons/fa";

export const CHALET_ICONS = [
    { id: 'house', icon: FaHome, label: 'Maison' },
    { id: 'tree', icon: FaTree, label: 'Sapin' },
    { id: 'pin', icon: FaMapMarkerAlt, label: 'Localisation' },
    { id: 'snow', icon: FaSnowflake, label: 'Neige' },
    { id: 'sun', icon: FaSun, label: 'Soleil' },
    { id: 'moon', icon: FaMoon, label: 'Lune' },
    { id: 'fire', icon: FaFire, label: 'Feu' },
    { id: 'wifi', icon: FaWifi, label: 'WiFi' },
    { id: 'cup', icon: FaCoffee, label: 'Tasse' },
    { id: 'car', icon: FaCar, label: 'Voiture' },
    { id: 'tv', icon: FaTv, label: 'TV' },
    { id: 'key', icon: FaKey, label: 'Clé' },
    { id: 'bed', icon: FaBed, label: 'Lit' },
    { id: 'door', icon: FaDoorOpen, label: 'Porte' },
    { id: 'heart', icon: FaHeart, label: 'Cœur' }
] as const;

export type ChaletIcon = typeof CHALET_ICONS[number]['id'];