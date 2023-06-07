import Carousel from 'react-bootstrap/Carousel';
import React from 'react';
import checkersMain from "../../assets/img/checkersMain-transformed.jpeg"
import tictactoeMain from "../../assets/img/tic-tac-toe-transformed.jpeg"

function Slider() {
    return (
        <Carousel
            style={{width: "700px", height: "450px"}}>
            <Carousel.Item
                interval={2000}>
                <img
                    style={{width: "700px", height: "450px"}}
                    className="d-block"
                    src={checkersMain}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h3>Checkers</h3>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item
                interval={2000}>
                <img
                    className="d-block"
                    style={{width: "700px", height: "450px"}}
                    src={tictactoeMain}
                    alt="Second slide"
                />
                <Carousel.Caption>
                    <h3>Tic-Tac-Toe</h3>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default Slider;