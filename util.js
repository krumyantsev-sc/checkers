export async function post(data, url) {
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
}

export async function get(url) {
    let response = await fetch(url);
    let json = null;
    if (response.ok) {
        json = await response.json();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
    return json;
}