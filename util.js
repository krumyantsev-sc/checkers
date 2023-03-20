export async function post(data, url) {
    return await fetch(url, {
        method: 'POST',
        accept: 'application/json;odata=verbose',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': "Bearer " + localStorage.getItem("token")
        }
    });
}

export async function get(url) {
    let response = await fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token")
        }
    });
    return await response.json();
}