import React, { useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import '../styles/resultsForm.scss';
import { getSubjectActivities } from '../services/SubjectManagementService';
import { useLocation } from 'react-router-dom';

const ResultsForm = () => {
    const location = useLocation();
    const { subject, selectedSchoolYear, selectedActivity } =
        location.state || {};

    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState({});
    const [activityData, setActivityData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
    const [showTop, setShowTop] = useState(false);
    const [showBottom, setShowBottom] = useState(false);

    const subjectCode = subject?.match(/\((\d+)\)/)?.[1];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY.current) {
                // Skrolovanje nadole
                setShowTop(true);
                setShowBottom(false);
            } else if (currentScrollY > lastScrollY.current) {
                // Skrolovanje nagore
                setShowTop(false);
                setShowBottom(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };
    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const data = await getSubjectActivities(subjectCode);
                const studentsInYear = data.studentSubjects.filter(
                    (student) => student.schoolYear == selectedSchoolYear,
                );
                setStudents(studentsInYear);

                const selected = data.activities.find(
                    (a) => a.name === selectedActivity,
                );
                setActivityData(selected);

                if (selected?.id) {
                    await loadExistingResults(selected.id, studentsInYear);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setSaveStatus({
                    type: 'error',
                    message: 'Greška pri učitavanju podataka',
                });
            }
        };

        if (subjectCode) fetchActivityData();
    }, [subjectCode, selectedSchoolYear, selectedActivity]);

    const loadExistingResults = async (activityId, studentList) => {
        try {
            const token = localStorage.getItem('token');
            const existingResults = {};

            for (const student of studentList) {
                try {
                    const response = await fetch(
                        `/api/results/${student.id}/${activityId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        },
                    );
                    if (response.ok) {
                        const result = await response.json();
                        existingResults[student.index] =
                            result.points.toString();
                    }
                } catch (error) {
                    // Result doesn't exist yet, which is fine
                    console.log(
                        `No existing result for student ${student.index}`,
                    );
                }
            }

            setResults(existingResults);
        } catch (error) {
            console.error('Error loading existing results:', error);
        }
    };

    const handleScoreChange = (index, value) => {
        // Convert to number and validate
        const numValue = parseFloat(value);
        const maxPoints = activityData?.maxPoints || 0;

        // If empty string, allow it (user is clearing the field)
        if (value === '') {
            setResults((prev) => ({ ...prev, [index]: '' }));
            return;
        }

        // If not a valid number, don't update
        if (isNaN(numValue)) {
            return;
        }

        // Clamp the value between 0 and maxPoints
        const clampedValue = Math.max(0, Math.min(numValue, maxPoints));

        setResults((prev) => ({ ...prev, [index]: clampedValue.toString() }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const maxPoints = activityData?.maxPoints || 0;

        // Example CSV parsing logic with validation
        const reader = new FileReader();
        reader.onload = (event) => {
            const lines = event.target.result.split('\n');
            const newResults = {};
            lines.forEach((line) => {
                const [index, score] = line.split(',');
                if (index && score) {
                    const numScore = parseFloat(score.trim());
                    if (!isNaN(numScore)) {
                        const clampedScore = Math.max(
                            0,
                            Math.min(numScore, maxPoints),
                        );
                        newResults[index.trim()] = clampedScore.toString();
                    }
                }
            });
            setResults((prev) => ({ ...prev, ...newResults }));
        };
        if (file) reader.readAsText(file);
    };

    const saveResults = async () => {
        if (!activityData?.id) {
            setSaveStatus({
                type: 'error',
                message: 'Nedostaju podaci o aktivnosti',
            });
            return;
        }

        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token); // Debug log

        setLoading(true);
        setSaveStatus({ type: '', message: '' });

        try {
            const batchData = Object.entries(results)
                .filter(
                    ([studentIndex, points]) =>
                        points !== '' && points !== undefined,
                )
                .map(([studentIndex, points]) => ({
                    studentIndex,
                    points: parseFloat(points),
                    subjectCode: subject?.match(/\((\d+)\)/)?.[1]
                        ? parseInt(subject.match(/\((\d+)\)/)[1])
                        : null,
                }));

            if (batchData.length === 0) {
                setSaveStatus({
                    type: 'warning',
                    message: 'Nema rezultata za čuvanje',
                });
                setLoading(false);
                return;
            }

            console.log('Sending batch data:', batchData); // Debug log

            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(
                `/api/results/batch/${activityData.id}`,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(batchData),
                },
            );

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                if (response.status === 401) {
                    setSaveStatus({
                        type: 'error',
                        message: 'Nemate dozvolu za ovu operaciju.',
                    });
                    return;
                }
                if (response.status === 404) {
                    setSaveStatus({
                        type: 'error',
                        message: 'Aktivnost nije pronađena.',
                    });
                    return;
                }

                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (e) {}

                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Save result:', result);

            if (result.errors && result.errors.length > 0) {
                setSaveStatus({
                    type: 'warning',
                    message: `Sačuvano ${result.successCount} rezultata. Greške: ${result.errors.join(', ')}`,
                });
            } else {
                setSaveStatus({
                    type: 'success',
                    message: `Uspešno sačuvano ${result.successCount} rezultata`,
                });
            }
        } catch (error) {
            console.error('Error saving results:', error);
            setSaveStatus({
                type: 'error',
                message: 'Greška pri čuvanju rezultata: ' + error.message,
            });
        } finally {
            setLoading(false);

            // Clear status message after 5 seconds
            setTimeout(() => {
                setSaveStatus({ type: '', message: '' });
            }, 5000);
        }
    };

    const filteredStudents = students.filter((s) =>
        `${s.firstName} ${s.lastName} ${s.index}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    const getStatusClassName = (type) => {
        switch (type) {
            case 'success':
                return 'status-success';
            case 'error':
                return 'status-error';
            case 'warning':
                return 'status-warning';
            default:
                return '';
        }
    };

    return (
        <div className="results-form">
            <HeaderComponent />
            <main className="main-content container">
                <div className="info-row">
                    <div class="field field-subject">
                        <label for="subject">Naziv predmeta</label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            readonly
                        />
                    </div>

                    <div class="field field-activity">
                        <label for="schoolYear">Aktivnost</label>
                        <input
                            type="text"
                            id="schoolYear"
                            value={`${activityData ? `${activityData.maxPoints} bodova` : ''}`}
                            readOnly
                        />
                    </div>
                    <div class="field field-year">
                        <label for="schoolYear">Školska godina</label>
                        <input
                            type="text"
                            id="schoolYear"
                            value={selectedSchoolYear}
                            readonly
                        />
                    </div>

                    <div class="result-buttons">
                        <button
                            id="importResult"
                            data-tooltip="Importovanje rezultata"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                        >
                            <span
                                class="material-icons"
                                title="Uvezi spisak studenata"
                            >
                                upload
                            </span>
                        </button>
                    </div>
                </div>

                {saveStatus.message && (
                    <div
                        className={`status-message ${getStatusClassName(saveStatus.type)}`}
                    >
                        {saveStatus.message}
                    </div>
                )}

                <div className="importResults-section-header">
                    <h2>Unos rezultata</h2>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Pretraga studenata..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="searcbar"
                        />
                    </div>
                </div>

                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Indeks</th>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Grupa</th>
                            <th className="width-20">
                                Rezultat (0-{activityData?.maxPoints || 0})
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, i) => (
                                <tr key={student.index}>
                                    <td>{student.index}</td>
                                    <td>{student.firstName}</td>
                                    <td>{student.lastName}</td>
                                    <td>{student.group}</td>
                                    <td className="score-cell">
                                        <div className="score-input-wrapper">
                                            <button
                                                type="button"
                                                className="score-btn"
                                                onClick={() =>
                                                    handleScoreChange(
                                                        student.index,
                                                        parseInt(
                                                            results[
                                                                student.index
                                                            ] || 0,
                                                        ) - 1,
                                                    )
                                                }
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                max={
                                                    activityData?.maxPoints || 0
                                                }
                                                value={
                                                    results[student.index] || ''
                                                }
                                                onChange={(e) =>
                                                    handleScoreChange(
                                                        student.index,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`0-${activityData?.maxPoints || 0}`}
                                                className="score-input"
                                            />
                                            <button
                                                type="button"
                                                className="score-btn"
                                                onClick={() =>
                                                    handleScoreChange(
                                                        student.index,
                                                        parseInt(
                                                            results[
                                                                student.index
                                                            ] || 0,
                                                        ) + 1,
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    Nema studenata
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button
                    onClick={saveResults}
                    disabled={loading}
                    className="save-btn"
                >
                    {loading ? 'Čuvanje...' : 'Sačuvaj rezultate'}
                </button>

                {showTop && (
                    <button
                        id="goTopBtn"
                        onClick={scrollToTop}
                        title="Idi na vrh"
                        style={{ display: 'flex' }}
                    >
                        <span className="material-icons">arrow_upward</span>
                    </button>
                )}

                {showBottom && (
                    <button
                        id="goBottomBtn"
                        onClick={scrollToBottom}
                        title="Idi na dno"
                        style={{ display: 'flex' }}
                    >
                        <span className="material-icons">arrow_downward</span>
                    </button>
                )}
            </main>
        </div>
    );
};

export default ResultsForm;
