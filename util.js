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
    return await response.json();
}