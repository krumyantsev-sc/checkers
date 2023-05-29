import React from 'react';
import SideMenu from "../SideMenu";
import Slider from "./Slider";
import "../../styles/Main.css"

const Main = () => {
    return (
        <div>
            <SideMenu/>
            <div
                className="main-page-container">
                <h1>GAMESINT</h1>
                <div
                    className="main-description">
                    Онлайн-платформа интеллектуальных игр, где вы можете играть с другими
                    игроками со всего мира.
                    Если вы ищете увлекательные интеллектуальные игры, возможность соревноваться с другими игроками со
                    всего мира и улучшить свои когнитивные способности, GAMESINT - это идеальное место для вас.
                    Попробуйте сыграть на нашей платформе уже сегодня и откройте для себя мир увлекательных игр!
                    Общайтесь в чате, играйте, получайте удовольствие!
                </div>
                <Slider/>
            </div>
        </div>
    );
};

export default Main;