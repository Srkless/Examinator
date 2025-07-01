const API_URL = 'http://localhost:8080/api/students';

export async function getStudents(
    code,
    pageNumber,
    pageSize,
    sortingQuery,
    sortDirection,
    year,
    searchTerm,
    indexSearchTerm,
) {
    const res = await fetch(
        `${API_URL}/subject/${code}/paged?page=${pageNumber}&direction=${sortDirection}&size=${pageSize}&sortBy=${sortingQuery}&searchQuery=${indexSearchTerm} ${searchTerm}  ${year}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        },
    );
    console.log(
        `${API_URL}/subject/${code}/paged?page=${pageNumber}&direction=${sortDirection}&size=${pageSize}&sortBy=${sortingQuery}&searchQuery=${indexSearchTerm}${searchTerm}  ${year}`,
    );
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
        throw new Error(`Greška pri dohvatanju studenata: ${message}`);
    }

    return data;
}

export async function addStudent(
    index,
    schoolYear,
    firstName,
    lastName,
    group,
    note,
    subject,
) {
    const res = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        },
        body: JSON.stringify({
            index,
            schoolYear: Number(schoolYear),
            firstName,
            lastName,
            group,
            note,
            subject,
        }),
    });
    console.log(
        JSON.stringify({
            index,
            schoolYear: Number(schoolYear),
            firstName,
            lastName,
            group,
            note,
            subject,
        }),
    );
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
        console.log(res);
        const message =
            typeof data === 'string'
                ? data
                : data.message || JSON.stringify(data);
        throw new Error(`Greška pri dodavanju studenta: ${message}`);
    }
    console.log(data);
    return data;
}

export async function updateStudent(
    id,
    index,
    schoolYear,
    firstName,
    lastName,
    group,
    note,
    subject,
) {
    const res = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        },
        body: JSON.stringify({
            id,
            index,
            schoolYear: Number(schoolYear),
            firstName,
            lastName,
            group,
            note,
            subject,
        }),
    });
    let data;
    const contentType = res.headers.get('Content-Type');
    const isJson = contentType && contentType.includes('application/json');
    const bodyText = await res.text();
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
        throw new Error(`Greska pri azuriranju studenta: ${message}`);
    }
}


export async function deleteStudent(id) {
    console.log('pozvan delet')
    const res = await fetch(`${API_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
        },
    });

    const bodyText = await res.text();
    let data;
    const contentType = res.headers.get('Content-Type');
    const isJson = contentType && contentType.includes('application/json');
    try {
        data = isJson ? JSON.parse(bodyText) : bodyText;
    } catch {
        data = bodyText;
    }
    if (!res.ok) {
        if (!res.ok) {
            const message =
                typeof data === 'string'
                    ? data
                    : data.message || JSON.stringify(data);
            throw new Error(`Greška pri brisanju studenta: ${message}`);
        }
    }
}

export async function getYears(code) {
    const res = await fetch(`${API_URL}/subject/years/${code}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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
        throw new Error(`Greška pri dohvatanju godina: ${message}`);
    }

    return data;
}


export async function addStudentsByFile(file, subjectCode) {



    const res = await fetch(`${API_URL}/subject/${subjectCode}/add-multiple-from-csv`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`

        },
        body: file
    })




    if (!res.ok) {
        throw new Error("Greška pri učitavanju studenata iz fajla")
    }
}

