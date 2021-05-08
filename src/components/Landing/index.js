import { useState, useEffect, useRef, useContext } from 'react';
import * as Mapillary from 'mapillary-js';
import 'mapillary-js/dist/mapillary.min.css';
import { Loader } from "@googlemaps/js-api-loader"
import cities from '../../cities.json';
import axios from 'axios';
import DifferenceDispay from '../DifferenceDisplay';
import { useHistory } from 'react-router-dom';
import FirebaseContext from '../Firebase/context';

const styles = {
    mapillary: {
        width: '100%',
        height: '37.5vh'
    },
    picker: {
        width: '100%',
        height: '37.5vh'
    },
    confirm: {
        margin: '10px',
    },
    columns: {
        'marginBottom': '6px'
    }
}

function Landing(props) {
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const [forceUpdate, setForceUpdate] = useState(true);
    const currentMarker = useRef(null);
    const viewer = useRef(null);
    const loader = useRef(null);
    const [guess, setGuess] = useState(null);
    const [answer, setAnswer] = useState({});
    const [score, setScore] = useState(0);
    const [phase, setPhase] = useState(0);
    const [round, setRound] = useState(1);
    const [keys, setKeys] = useState(null);

    useEffect(() => {
        viewer.current = new Mapillary.Viewer({
            container: 'mapillaryjs',
            apiClient: process.env.REACT_APP_MAPILLARY_API_KEY,
        });

        viewer.current.on('positionchanged', () => viewer.current.getPosition().then((pos) => {
            setAnswer({ lat: pos.lat, lng: pos.lon });
        }));

        loader.current = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
            version: "weekly",
            libraries: ['geometry']
        });

        loader.current.load().then(() => {
            // eslint-disable-next-line no-undef
            const maps = google.maps;
            let map = new maps.Map(document.getElementById("picker"), {
                center: { lat: 0, lng: 30 },
                zoom: 2,
            });

            map.controls[maps.ControlPosition.BOTTOM_CENTER].push(
                document.getElementById("confirm")
            );

            let geocoder = new maps.Geocoder();
            geocoder.geocode({ 'address': cities[Math.floor(Math.random() * 81)].city }, function (results, status) {
                if (status === 'OK') {
                    let lat = results[0].geometry.location.lat();
                    let lng = results[0].geometry.location.lng();
                    axios.get('https://a.mapillary.com/v3/images', {
                        params: {
                            client_id: process.env.REACT_APP_MAPILLARY_API_KEY,
                            bbox: [lng - 0.1, lat - 0.1, lng + 0.1, lat + 0.1],
                            min_quality_score: 3
                        }
                    }).then((coords) => {
                        setKeys(coords.data.features);
                        if (coords.data.features.length === 0) {
                            setForceUpdate(!forceUpdate);
                            return;
                        }
                        viewer.current.moveToKey(coords.data.features[Math.floor(Math.random() * coords.data.features.length)].properties.key);
                    });
                } else {
                    console.error(status);
                }
            });


            currentMarker.current = new maps.Marker();
            currentMarker.current.setMap(map);

            map.addListener('click', (event) => {
                currentMarker.current.setPosition(event.latLng);
                setGuess(event.latLng);
            });
        });
    }, [round, forceUpdate]);

    const handleSubmit = () => {
        currentMarker.current.setMap(null);
        setPhase(1);
        loader.current.load().then(() => {
            // eslint-disable-next-line no-undef
            const maps = google.maps;
            setScore(score + Math.round(maps.geometry.spherical.computeDistanceBetween(new maps.LatLng(answer), guess) / 1000));
        })
    }

    const nextKey = () => {
        viewer.current.moveToKey(keys[Math.floor(Math.random() * 200)].properties.key);
    }

    const nextRound = () => {
        if (round === 5) {
            if (firebase.auth.currentUser) {
                firebase.addScore(score);
            }
            history.push('/endgame', {
                score: score
            });
        }
        setGuess(null);
        setPhase(0);
        setRound(round + 1);
    }

    return (
        <div className="section">
            <div className="container box">
                <div className="columns" style={styles.columns}>
                    <div className="column is-6 is-offset-3 has-text-centered">
                        <h1 id="score" className="title is-5">Round: {round} of 5 | Score (lower is better): {score}</h1>
                    </div>
                    <div className="column is-1 is-offset-2 has-text-centered">
                        <button onClick={nextKey} title="Use this if the current street view images are of low quality." className="button is-small">Refresh</button>
                    </div>
                </div>
                {phase === 0 ? <Game guess={guess} handleSubmit={handleSubmit} /> : <DifferenceDispay nextRound={nextRound} guess={guess} answer={answer} />}
            </div>
        </div>
    )
}

function Game(props) {
    useEffect(() => { }, [props.guess]);
    return (
        <div>
            <div id="mapillaryjs" style={styles.mapillary} />
            <div id="picker" style={styles.picker} />
            <button id="confirm" disabled={!props.guess} onClick={props.handleSubmit} className="button is-primary" style={styles.confirm}>Confirm Position</button>
        </div>
    )
}

export default Landing;