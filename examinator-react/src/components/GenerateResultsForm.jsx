import React, { useRef } from 'react';
import HeaderComponent from './HeaderComponent';
import '../styles/generateResults.scss';
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
    getStudents,
    getYears,
    getStudentsFromFile,
    getStudentsBySubject,
    getStudentsFromFileAll,
} from '../services/StudentService';
import {
    getSubjectActivities,
    getUsersOnSubject,
} from '../services/SubjectManagementService';
const STUDENT_FIELDS = ['Indeks', 'Ime', 'Prezime', 'Grupa', 'Napomena'];
import { calculate } from '../services/resultService';

const columnFieldMap = {
    Indeks: 'index',
    Ime: 'firstName',
    Prezime: 'lastName',
    Grupa: 'group',
    Napomena: 'note',
};
function GenerateResultsForm() {
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [studentSource, setStudentSource] = useState('svi');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDirection, setSortDirection] = useState({});
    const [students, setStudents] = useState();
    const [data, setData] = useState([]);
    const [content, setContent] = useState([]);
    const [schoolYears, setSchoolYears] = useState(new Set());
    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedLength, setSelectedLength] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogText, setDialogText] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [subjectJson, setSubjectJson] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentLastName, setStudentLastName] = useState('');
    const [studentIndex, setStudentIndex] = useState('');
    const [studentGroup, setStudentGroup] = useState('');
    const [studentNote, setStudentNote] = useState('');
    const [subjectActivities, setSubjectActivities] = useState([]);
    const [subjectFormulas, setSubjectFormulas] = useState([]);
    const [showTop, setShowTop] = useState(false);
    const [showBottom, setShowBottom] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState('');

    const lastScrollY = useRef(0);
    const fileInputRef = useRef(null);

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

    const handleRadioChange = () => {
        // Ne postavlja studentSource odmah, samo otvara file explorer
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 100);
    };
    // Detektovanje otkazivanja file dialoga
    useEffect(() => {
        const handleFocus = () => {
            setTimeout(() => {
                if (
                    fileInputRef.current &&
                    !fileInputRef.current.files.length
                ) {
                    console.log('Korisnik je otkazao izbor fajla');
                    setStudentSource('svi'); // Vraća na "svi" ako je otkazano
                    setFormData(''); // Očisti formData ako je otkazano
                }
            }, 300);
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.log('Nije izabran nijedan fajl');
            setStudentSource('svi'); // Vraća na "svi" ako nije izabran <fajl>
            setFormData(''); // Očisti formData ako nije izabran <fajl>
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        setStudentSource('fajl');
        setFormData(formData);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };

    const location = useLocation();
    const subject = location.state?.subject;
    const tableRef = useRef(null);

    useEffect(() => {
        document.body.classList.forEach((className) => {
            if (className !== 'dark-theme') {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add('students-body');
    }, []);

    const code = subject.match(/\((\d+)\)/)[1];

    const fetchStudents = useCallback(
        async (
            page = currentPage,
            resetPage = false,
            length = selectedLength,
        ) => {
            if (schoolYears.length === 0) return;

            try {
                let students;
                if (studentSource === 'fajl') {
                    students = await getStudentsFromFile(
                        code,
                        resetPage ? 0 : page,
                        length,
                        selectedYear,
                        formData,
                    );
                } else if (studentSource === 'svi') {
                    students = await getStudents(
                        code,
                        resetPage ? 0 : page,
                        length,
                        selectedYear,
                    );
                }

                setData(students);
                setContent(students.content);
                setTotalPages(students.totalPages);

                if (resetPage) {
                    setCurrentPage(0);
                }

                const { activities, formulas } =
                    await getSubjectActivities(code);

                activities.forEach((a) => {
                    columnFieldMap[a.shortName] = a.shortName; // npr. "K1": "K1"
                });
                formulas.forEach((f) => {
                    columnFieldMap[f.expression] = f.expression; // npr. "K1": "K1"
                });

                const activityIdToShortName = Object.fromEntries(
                    activities.map((a) => [a.id, a.shortName]),
                );
                const transformed = students.content.map((student) => {
                    const resultMap = {};

                    student.results.forEach((res) => {
                        const activityId = res.id.activityId;
                        const shortName = activityIdToShortName[activityId];
                        if (shortName) {
                            resultMap[shortName] = res.points;
                            console.log(resultMap);
                        }
                    });
                    return {
                        ...student,
                        ...resultMap, // dodaje K1, K2, PR sa bodovima
                    };
                });

                setContent(transformed);
                const studentIndexes = students.content.map((s) => s.index);
                const resultsByFormula = {};
                for (const formula of formulas) {
                    resultsByFormula[formula.expression] = await calculate(
                        formula.expression,
                        studentIndexes,
                        code,
                    );
                }
                const transformedWithFormulas = transformed.map(
                    (student, idx) => {
                        const resMap = {};
                        for (const formula of formulas) {
                            resMap[formula.expression] =
                                resultsByFormula[formula.expression][idx];
                        }
                        console.log(resMap);
                        return {
                            ...student,
                            ...resMap,
                        };
                    },
                );
                setContent(transformedWithFormulas);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        },
        [code, currentPage, selectedYear, studentSource, formData],
    );

    async function exportToCSV(filename = `${selectedSubject}_results.csv`) {
        try {
            let fetchedData;
            if (studentSource === 'fajl') {
                fetchedData = await getStudentsFromFileAll(code, formData);
            } else if (studentSource === 'svi') {
                fetchedData = await getStudentsBySubject(code);
            }
            if (!fetchedData || fetchedData.length === 0) {
                alert('Nema podataka za izvoz!');
                return;
            }

            const { activities } = await getSubjectActivities(code);

            activities.forEach((a) => {
                columnFieldMap[a.shortName] = a.shortName; // npr. "K1": "K1"
            });
            const activityIdToShortName = Object.fromEntries(
                activities.map((a) => [a.id, a.shortName]),
            );
            const transformed = fetchedData.map((student) => {
                const resultMap = {};

                student.results.forEach((res) => {
                    const activityId = res.id.activityId;
                    const shortName = activityIdToShortName[activityId];
                    if (shortName) {
                        resultMap[shortName] = res.points;
                    }
                });
                return {
                    ...student,
                    ...resultMap, // dodaje K1, K2, PR sa bodovima
                };
            });
            const csvRows = [];

            // Zaglavlja su nazivi kolona koje korisnik vidi (keys iz selectedColumns)
            csvRows.push(selectedColumns.join(','));

            for (const row of transformed) {
                const values = selectedColumns.map((col) => {
                    const field = columnFieldMap[col]; // npr. 'Ime' -> 'firstName'
                    const val = row[field];
                    return val !== undefined ? `"${val}"` : '""';
                });
                csvRows.push(values.join(','));
            }

            const csvString = csvRows.join('\n');

            const blob = new Blob([csvString], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            alert('Greška pri dohvatanju podataka: ' + error.message);
        }
    }

    async function copyTableToClipboard() {
        try {
            let fetchedData;
            if (studentSource === 'fajl') {
                fetchedData = await getStudentsFromFileAll(code, formData);
            } else if (studentSource === 'svi') {
                fetchedData = await getStudentsBySubject(code);
            }
            if (!fetchedData || fetchedData.length === 0) {
                alert('Nema podataka za izvoz!');
                return;
            }

            const { activities } = await getSubjectActivities(code);

            activities.forEach((a) => {
                columnFieldMap[a.shortName] = a.shortName; // npr. "K1": "K1"
            });
            const activityIdToShortName = Object.fromEntries(
                activities.map((a) => [a.id, a.shortName]),
            );
            const transformed = fetchedData.map((student) => {
                const resultMap = {};

                student.results.forEach((res) => {
                    const activityId = res.id.activityId;
                    const shortName = activityIdToShortName[activityId];
                    if (shortName) {
                        resultMap[shortName] = res.points;
                    }
                });
                return {
                    ...student,
                    ...resultMap, // dodaje K1, K2, PR sa bodovima
                };
            });
            const header = selectedColumns.join('\t');

            // Zatim pripremi svaki red sa vrednostima polja
            const rows = transformed.map((row) =>
                selectedColumns
                    .map((col) => row[columnFieldMap[col]] ?? '') // koristi vrednost ili prazno
                    .join('\t'),
            );

            // Spoji header i redove sa novim redom
            const tsv = [header, ...rows].join('\n');

            // Kopiraj u clipboard
            navigator.clipboard
                .writeText(tsv)
                .then(() => {
                    alert('Tabela je kopirana u clipboard!');
                })
                .catch((err) => {
                    alert('Nešto je pošlo po zlu: ' + err);
                });
        } catch (error) {
            return;
        }
    }
    useEffect(() => {
        const fetchYears = async () => {
            if (!code) return;

            try {
                const years = await getYears(code);
                setSchoolYears(years);
                if (years.length > 0) {
                    setSelectedYear(years[0]);
                }
            } catch (error) {
                console.error('Error fetching years:', error);
            }
        };

        fetchYears();
    }, [code]);

    useEffect(() => {
        fetchStudents(0, true, selectedLength);
    }, []);

    useEffect(() => {
        fetchStudents(0, true, selectedLength);
    }, [studentSource]);

    useEffect(() => {
        if (content.length > 0) {
            tableRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [content, currentPage]);

    useEffect(() => {
        const savedSubject = localStorage.getItem('selectedSubject');
        if (savedSubject) setSelectedSubject(savedSubject);
    }, []);

    useEffect(() => {
        const fetchActivities = async () => {
            if (!code) return;

            try {
                const subject = await getSubjectActivities(code);
                setSubjectActivities(subject.activities);
                setSubjectFormulas(subject.formulas);
                setSelectedSubject(subject.name);
            } catch (error) {
                console.error('Error fetching years:', error);
            }
        };

        fetchActivities();
    }, [code]);

    const handleColumnToggle = (label) => {
        setSelectedColumns((prev) =>
            prev.includes(label)
                ? prev.filter((col) => col !== label)
                : [...prev, label],
        );
    };

    const handleSort = (column) => {
        setSortDirection((prev) => {
            const newDirection = !prev[column]; // true = ASC, false = DESC

            const sorted = [...content].sort((a, b) => {
                const valA = a[columnFieldMap[column]] ?? '';
                const valB = b[columnFieldMap[column]] ?? '';

                if (valA < valB) return newDirection ? -1 : 1;
                if (valA > valB) return newDirection ? 1 : -1;
                return 0;
            });

            setContent(sorted);

            return {
                ...prev,
                [column]: newDirection,
            };
        });
    };

    useEffect(() => {
        if (currentPage >= 0) {
            fetchStudents(currentPage, false);
        }
    }, [currentPage]);

    const schoolYearChange = (event) => {
        setSelectedYear(event.target.value);
        fetchStudents(0, true, selectedLength);
    };
    const selectedLengthChange = (event) => {
        setSelectedLength(event.target.value);
        fetchStudents(0, true, event.target.value);
    };

    const changePage = (next = true) => {
        if (next === true) {
            if (currentPage + 1 != totalPages) {
                setCurrentPage(currentPage + 1);
            }
        } else {
            if (currentPage != 0) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    return (
        <div>
            <HeaderComponent />
            <main className="main-content container">
                <div className="genResults-subject-row">
                    <div className="field field-subject">
                        <label htmlFor="subject">Naziv predmeta</label>
                        <input
                            type="text"
                            id="subject"
                            value={selectedSubject}
                            readOnly
                        />
                    </div>

                    <div class="field field-year">
                        <label for="schoolYear">Školska godina</label>
                        <select id="schoolYear" onChange={schoolYearChange}>
                            {Array.from(schoolYears).map((year) => (
                                <option key={year} value={year}>
                                    {year}/{year + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="checkbox-section">
                    <div className="section">
                        <strong>Student:</strong>
                        {STUDENT_FIELDS.map((label) => (
                            <label key={label}>
                                <input
                                    type="checkbox"
                                    checked={selectedColumns.includes(label)}
                                    onChange={() => handleColumnToggle(label)}
                                />{' '}
                                {label}
                            </label>
                        ))}
                    </div>

                    <div className="section">
                        <strong>Aktivnosti:</strong>
                        {subjectActivities.map((label) => (
                            <label key={label.shortName}>
                                <input
                                    type="checkbox"
                                    checked={selectedColumns.includes(
                                        label.shortName,
                                    )}
                                    onChange={() =>
                                        handleColumnToggle(label.shortName)
                                    }
                                />{' '}
                                {label.shortName}
                            </label>
                        ))}
                    </div>

                    <div className="section">
                        <strong>Formule:</strong>
                        {subjectFormulas.map((label) => (
                            <label key={label.expression}>
                                <input
                                    type="checkbox"
                                    checked={selectedColumns.includes(
                                        label.expression,
                                    )}
                                    onChange={() =>
                                        handleColumnToggle(label.expression)
                                    }
                                />{' '}
                                {label.name}({label.expression})
                            </label>
                        ))}
                    </div>

                    <div className="section">
                        <strong>Studenti na predmetu:</strong>
                        <label>
                            <input
                                type="radio"
                                name="studentSource"
                                value="svi"
                                checked={studentSource === 'svi'}
                                onChange={() => setStudentSource('svi')}
                            />{' '}
                            svi
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="studentSource"
                                value="fajl"
                                checked={studentSource === 'fajl'}
                                onChange={handleRadioChange}
                            />{' '}
                            prema spisku
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                            accept=".txt,.csv,.xlsx,.xls" // Dodajte željene tipove fajlova
                        />
                    </div>
                </div>

                <div className="selected-columns">
                    <strong>Kolone:</strong>{' '}
                    <span>{selectedColumns.join(', ')}</span>
                </div>

                <div className="table-section">
                    {selectedColumns.length === 0 ? (
                        <p className="no-data">
                            Izaberite kolone koje želite da imate u tabeli
                        </p>
                    ) : (
                        <table ref={tableRef}>
                            <thead>
                                <tr>
                                    {selectedColumns.map((col) => (
                                        <th
                                            key={col}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleSort(col)}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {content.map((student, index) => (
                                    <tr key={index}>
                                        {selectedColumns.map((col) => {
                                            const field = columnFieldMap[col]; // npr. 'firstName' za 'Ime'
                                            return (
                                                <td key={col}>
                                                    {student[field] ?? ''}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div id="paginationWrapper">
                    <div id="paginationCenter">
                        {data.totalPages > 1 ? (
                            <div id="paginationControls">
                                <span
                                    class="material-icons"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setCurrentPage(0)}
                                >
                                    first_page
                                </span>
                                <span
                                    class="material-icons"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => changePage(false)}
                                >
                                    navigate_before
                                </span>
                                <div
                                    id="paginationInfo"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {currentPage + 1} / {data.totalPages}
                                </div>
                                <span
                                    class="material-icons"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => changePage()}
                                >
                                    navigate_next
                                </span>
                                <span
                                    class="material-icons"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        setCurrentPage(totalPages - 1)
                                    }
                                >
                                    last_page
                                </span>
                            </div>
                        ) : (
                            <div id="paginationControls">
                                <div id="paginationInfo">1 / 1</div>
                            </div>
                        )}
                    </div>

                    <select
                        id="rowsPerPage"
                        onChange={selectedLengthChange}
                        value={selectedLength}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <div className="buttons action-buttons">
                    <button
                        style={{
                            display: selectedColumns.length
                                ? 'inline-block'
                                : 'none',
                        }}
                        className="export-btn"
                        onClick={() => exportToCSV()}
                    >
                        Export (CSV)
                    </button>

                    <button
                        style={{
                            display: selectedColumns.length
                                ? 'inline-block'
                                : 'none',
                        }}
                        className="export-btn"
                        onClick={() => copyTableToClipboard(content)}
                    >
                        Kopiraj u Clipboard
                    </button>
                </div>
                <button
                    id="goTopBtn"
                    title="Idi na vrh"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                >
                    <span className="material-icons">arrow_upward</span>
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
}

export default GenerateResultsForm;
