const API_URL = 'http://localhost:8080/api/formula';


export async function addFormula(name, expression, schoolYear, subjectCode) {



    const res = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        },
        body: JSON.stringify({ name, expression, schoolYear: Number(schoolYear), subjectCode })
    })

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
        throw new Error(`Greška pri dodavanju formule: ${message}`)

    }
    console.log(data)
    return data;
}




export async function updateFormula(id, name, expression, schoolYear, subject) {
    const res = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        },
        body: JSON.stringify({ id, name, expression, schoolYear, subject })

    })
    const bodyText = await res.text();
    const contentType = res.headers.get('Content-Type')
    const isJson = contentType && contentType.includes('application/json')
    let data
    try {
        data = isJson ? JSON.parse(bodyText) : bodyText
    } catch {
        data = bodyText
    }

    console.log(bodyText)
    if (!res.ok) {
        const message = typeof data === 'string' ? data : data.message || JSON.stringify(data)
        throw new Error(`Greška pri azuriranju formule: ${message}`)

    }

}
export async function deleteFormula(id) {
    console.log('pozvan delete')
    const res = await fetch(`${API_URL}/delete/${id}`, {

        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        }
    })
    const bodyText = await res.text();
    const contentType = res.headers.get('Content-Type')
    const isJson = contentType && contentType.includes('application/json')
    let data
    try {
        data = isJson ? JSON.parse(bodyText) : bodyText
    } catch {
        data = bodyText
    }

    if (!res.ok) {
        const message = typeof data === 'string' ? data : data.message || JSON.stringify(data)
        throw new Error(`Greška pri brisanju formule: ${message}`)

    }


}
