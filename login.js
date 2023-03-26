import {post} from "./util.js";

const loginForm = document.querySelector(".form-login");
const passwordForm = document.querySelector(".form-password");
const submitBtn = document.querySelector(".btn__login");
const usernameSpan = document.querySelector(".user-name")
console.log("123")
submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log("1")
    const data = {
        username: loginForm.value,
        password: passwordForm.value
    };
    post(data, "http://localhost:3001/auth/login")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("token", data.token);
            console.log(data);
        })

});