import { useState, useRef, useEffect } from "react";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from "@react-google-maps/api";
import SpinnerComponent from "./SpinnerComponent";
import { IconButton, Button } from "@mui/material";

function MapComponent({ onePackage }) {
    const center = { lat: -1.292066, lng: 36.821945 };
    const [map, setMap] = useState(/** @type Google.maps.map */ (null));
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");

    const originRef = useRef();
    const destinationRef = useRef();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    const calculateRoute = async () => {
        if (originRef === "" || destinationRef === "") {
            return;
        }
        //eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: onePackage.from_address,
            destination: onePackage.to_address,
            //eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
    };
    calculateRoute();
    useEffect(() => {
        const clearAll = () => {
            setDirectionsResponse(null);
            setDistance("");
            setDuration("");
            originRef.current.value = "";
            destinationRef.current.value = "";
        };
    }, [directionsResponse]);
    if (!isLoaded) {
        return <SpinnerComponent />;
    }
    return (
        <div className="google-map">
            {/* <div>
                <Button onClick={calculateRoute}>calculate</Button>
                <Button onClick={clearAll}>X</Button>
                
            </div> */}
            <div>
                <span style={{ marginRight: "3rem" }}>
                    Origin(A): {onePackage.from_address}
                </span>
                Destination(B): {onePackage.to_address}
                <br />
                Duration: {duration}
                <br />
                Distance: {distance}
            </div>

            <GoogleMap
                center={center}
                zoom={10}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
                onLoad={(map) => setMap(map)}
            >
                <Marker position={center} />
                <IconButton onClick={() => map.panTo(center)}>
                    <i class="fa fa-location-arrow" aria-hidden="true"></i>
                </IconButton>
                {directionsResponse && (
                    <DirectionsRenderer directions={directionsResponse} />
                )}
            </GoogleMap>
        </div>
    );
}

export default MapComponent;
