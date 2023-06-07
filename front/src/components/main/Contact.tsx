import React from 'react';
import SideMenu from "../SideMenu";
import "../../styles/Contact.css"
import {YMaps, Map, Placemark} from '@pbe/react-yandex-maps';
import {faMapPin, faPhone, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faInstagram, faFacebook, faVk} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from 'react-router-dom';

const Contact = () => {

    const defaultState = {
        center: [53.91226840873304, 27.59435918740403],
        zoom: 15,
    };

    return (
        <div>
            <SideMenu/>
            <div
                className="contact-page">
                <span
                    className="contact-header">
                    Контактная информация
                </span>
                <div
                    className="contact-info-container">
                    <div
                        className="contacts-container">
                        <div
                            className="address">
                            <FontAwesomeIcon
                                icon={faMapPin} size="xl"
                                style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}
                            />
                            г. Минск, ул. Гикало, 9
                        </div>
                        <div
                            className="address">
                            <FontAwesomeIcon
                                icon={faPhone}
                                size="xl"
                                style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}
                            />
                            +375336749291
                        </div>
                        <div
                            className="address">
                            <FontAwesomeIcon
                                icon={faEnvelope} size="xl"
                                style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>
                            kiril.rumyantsev228@gmail.com
                        </div>
                        <div
                            className="sm-icons">
                            <Link
                                to="https://www.instagram.com/">
                                <FontAwesomeIcon
                                    icon={faInstagram}
                                    size="xl"
                                    style={{
                                        color: "#3ed2f0",
                                        width: 40,
                                        height: 40,
                                        marginRight: 15
                                    }}
                                />
                            </Link>
                            <Link
                                to="https://www.facebook.com/">
                                <FontAwesomeIcon
                                    icon={faFacebook}
                                    size="xl"
                                    style={{
                                        color: "#3ed2f0",
                                        width: 40,
                                        height: 40,
                                        marginRight: 15
                                    }}
                                />
                            </Link>
                            <Link
                                to="https://www.vk.com/">
                                <FontAwesomeIcon
                                    icon={faVk}
                                    size="xl"
                                    style={{
                                        color: "#3ed2f0",
                                        width: 40,
                                        height: 40
                                    }}
                                />
                            </Link>
                        </div>
                    </div>
                    <YMaps>
                        <Map
                            defaultState={defaultState}
                            style={{width: 600, height: 600}}
                        >
                            <Placemark
                                geometry={[53.91226840873304, 27.59435918740403]}
                            />
                        </Map>
                    </YMaps>
                </div>
            </div>
        </div>
    );
};

export default Contact;