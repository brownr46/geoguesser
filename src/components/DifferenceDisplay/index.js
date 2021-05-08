import { useEffect, useMemo } from 'react';
import { Loader } from "@googlemaps/js-api-loader"

const styles = {
    diff: {
        height: '75vh',
        width: '100%'
    },
    next: {
        margin: '10px'
    }
}

function DifferenceDispay(props) {
    const loader = useMemo(() => new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        version: "weekly",
        libraries: ['geometry']
    }), []);

    useEffect(() => {
        loader.load().then(() => {
            // eslint-disable-next-line no-undef
            const maps = google.maps;
            let map = new maps.Map(document.getElementById("diff_display"), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });

            map.controls[maps.ControlPosition.BOTTOM_CENTER].push(
                document.getElementById("next_loc")
            );

            let answer = new maps.Marker({
                position: props.answer,
                map,
                label: "Real Location"
            })
            let guess = new maps.Marker({
                position: props.guess,
                map,
                label: "Your Answer"
            })
            let sw = {
                lat: Math.max(answer.getPosition().lat(), guess.getPosition().lat()),
                lng: Math.min(answer.getPosition().lng(), guess.getPosition().lng())
            };
            let ne = {
                lat: Math.min(answer.getPosition().lat(), guess.getPosition().lat()),
                lng: Math.max(answer.getPosition().lng(), guess.getPosition().lng())
            };
            map.fitBounds(new maps.LatLngBounds(sw, ne));
            let poly = new maps.Polyline({
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: map,
            });
            poly.setPath([answer.getPosition(), guess.getPosition()]);
        })
    }, [loader, props.answer, props.guess]);


    return (
        <div>
            <div style={styles.diff} id="diff_display"></div>
            <button id="next_loc" onClick={props.nextRound} className="button is-primary" style={styles.next}>Continue</button>
        </div>
    )
}

export default DifferenceDispay;