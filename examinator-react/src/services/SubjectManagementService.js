const API_URL = 'http://localhost:8080/api/subjects';

export async function addSubject(name, code) {
    const res = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        },
        body: JSON.stringify({ name, code }),
    });

    const contentType = res.headers.get('Content-Type');
    const isJson = contentType && contentType.includes('application/json');

    const bodyText = await res.text();

    let data;
    try {
        data = isJson ? JSON.parse(bodyText) : bodyText;
    } catch {
        data = bodyText;
    }

    if (!res.ok) {
        const message =
            typeof data === 'string'
                ? data
                : data.message || JSON.stringify(data);
        throw new Error(`Greška pri registraciji: ${message}`);
    }

    return data;
}
