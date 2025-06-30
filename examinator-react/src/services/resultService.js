const API_URL = 'http://localhost:8080/api/results';
export async function calculate(formula, studentIndexes, subjectCode) {
    try {
        const response = await fetch(`${API_URL}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // <-- ispravljeno!
            },
            body: JSON.stringify({
                formula,
                studentIndexes,
                subjectCode,
            }),
        });

        if (!response.ok) {
            throw new Error(`Greška: ${response.status}`);
        }

        const results = await response.json();
        return results; // Lista rezultata
    } catch (error) {
        console.error(
            'Greška prilikom slanja zahteva za izračunavanje rezultata:',
            error,
        );
        return null;
    }
}
