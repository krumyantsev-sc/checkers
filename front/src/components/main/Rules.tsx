import React from 'react';
import SideMenu from "../SideMenu";
import "../../styles/Rules.css"
import {faDice, faPhone} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Rules = () => {
    return (
        <div>
            <SideMenu/>
            <div className="rules-page">
                <span className="rules-header">Rules</span>
                <div className="rules-container">
                    <div className="game-rules-container">
                        <span className="rules-name-header">Checkers</span>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Играют
                            два игрока на игровой доске, которая представляет собой квадрат размером 8х8 клеток.
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Каждый
                            игрок начинает игру с 12 фишками, расположенными на черных клетках трех рядов, прилегающих к
                            нему.
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Фишки
                            движутся только по черным клеткам вперёд по диагонали. Фишка может двигаться только вперёд,
                            если она не стала дамкой (королём).
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Обычная
                            фишка может сделать ход только вперёд на одну клетку по диагонали на свободную клетку.
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Если на
                            пути фишки стоит фишка противника и за ней есть свободная клетка, игрок может совершить
                            "взятие".
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>В этом
                            случае фишка противника снимается с доски, а собственная фишка занимает клетку, находящуюся
                            сразу за фишкой противника.
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/> Если
                            фишка достигает последнего ряда противника, она становится дамкой (королём).
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Дамка
                            может ходить на одно поле по диагонали вперёд или назад, при взятии ходит только через одно
                            поле в любую сторону.
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Первый
                            ход делают чёрные.
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Цель
                            игры — либо захватить все фишки противника, либо заблокировать все фишки противника, чтобы у
                            него не было возможности сделать ход.
                        </div>
                    </div>
                    <div className="game-rules-container">
                        <span className="rules-name-header">Tic-Tac-Toe</span>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Играют
                            два игрока на квадратной игровой доске размером 3x3 клетки.
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Один
                            игрок играет крестиками (X), а другой игрок — ноликами (O).
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Игроки
                            по очереди ставят свои символы на пустые клетки доски. Крестик ставится игроком X, а нолик —
                            игроком O.
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Цель
                            игры — получить три своих символа в ряд (горизонтально, вертикально или по диагонали) или
                            заполнить всю доску без победителя (ничья).
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Если
                            один из игроков образовал ряд из трех своих символов, он объявляется победителем, и игра
                            завершается.
                        </div>
                        <div className="rule">
                            <FontAwesomeIcon icon={faDice} size="xl"
                                             style={{color: "#3ed2f0", width: 40, height: 40, marginRight: 10}}/>Если
                            все клетки доски заполнены, но ни один из игроков не образовал ряда из трех своих символов,
                            игра заканчивается ничьей.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rules;