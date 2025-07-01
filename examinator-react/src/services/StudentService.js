const API_URL = 'http://localhost:8080/api/students/subject';

export async function getStudentsBySubject(code) {
    const res = await fetch(`${API_URL}/${code}`, {
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
        throw new Error(`Greška pri dohvatanju studenata: ${message}`);
    }

    return data;
}
export async function getStudents(code, pageNumber, pageSize, year, sortingQuery, sortingDirection) {
    const res = await fetch(
        `${API_URL}/${code}/paged?page=${pageNumber}&size=${pageSize}&sortBy=${sortingQuery}&direction=${sortingDirection}&searchQuery=   ${year}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        },
    );
    console.log(
        `${API_URL}/${code}/paged?page=${pageNumber}&size=${pageSize}&searchQuery=   ${year}`,
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
export async function getStudentsFromFile(
    code,
    pageNumber,
    pageSize,
    year,
    formData,
) {
    const res = await fetch(
        `${API_URL}/${code}/upload/paged?page=${pageNumber}&size=${pageSize}&searchQuery=   ${year}`,
        {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        },
    );
    console.log(
        `${API_URL}/${code}/upload/paged?page=${pageNumber}&size=${pageSize}&searchQuery=   ${year}`,
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

export async function getStudentsFromFileAll(code, formData) {
    const res = await fetch(`${API_URL}/${code}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    console.log(`${API_URL}/${code}/upload`);
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

export async function addStudent() { }

export async function getYears(code) {
    const res = await fetch(`${API_URL}/years/${code}`, {
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
