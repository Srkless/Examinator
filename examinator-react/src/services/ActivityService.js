const API_URL = 'http://localhost:8080/api/activity';


export async function addActivity(name, shortName, maxPoints, schoolYear, subject) {



    const res = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        },
        body: JSON.stringify({ name, shortName, maxPoints: Number(maxPoints), schoolYear, subject })
    })
    console.log(res)

    const contentType = res.headers.get('Content-Type')
    const isJson = contentType && contentType.includes('application/json')

    const bodyText = await res.text()

    let data
    try {
        data = isJson ? JSON.parse(bodyText) : bodyText
    } catch {
        data = bodyText
    }

    if (!res.ok) {
        const message = typeof data === 'string' ? data : data.message || JSON.stringify(data)
        throw new Error(`Greška pri dodavanju aktivnosti: ${message}`)

    }
    console.log(data)
    return data;


}
export async function updateActivity(id, name, shortName, maxPoints, schoolYear, subject) {
    const res = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        },
        body: JSON.stringify({ id, name, shortName, maxPoints: Number(maxPoints), schoolYear, subject })

    })
    console.log(JSON.stringify({ name, shortName, maxPoints: Number(maxPoints), schoolYear, subject }))
    console.log(res)
    const bodyText = await res.text();
    console.log(bodyText)
    if (!res.ok) {
        const message = typeof data === 'string' ? data : data.message || JSON.stringify(data)
        throw new Error(`Greška pri dodavanju aktivnosti: ${message}`)

    }

}

export async function deleteActivity(id) {
    const res = await fetch(`${API_URL}/delete/${id}`, {

        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        }
    })

    if (!res.ok) {
        const message = typeof data === 'string' ? data : data.message || JSON.stringify(data)
        throw new Error(`Greška pri dodavanju aktivnosti: ${message}`)

    }


}


