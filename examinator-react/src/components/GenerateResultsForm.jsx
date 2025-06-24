import React from 'react';
import HeaderComponent from './HeaderComponent';
import '../styles/generateResults.scss';
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getStudents, getYears } from '../services/StudentService';
import { getSubjectActivities } from '../services/SubjectManagementService';

const STUDENT_FIELDS = ['Indeks', 'Ime', 'Prezime', 'Grupa', 'Napomena'];

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
    const [generatedResults, setGeneratedResults] = useState(true);

    const location = useLocation();
    const subject = location.state?.subject;

    useEffect(() => {
        document.body.classList.forEach((className) => {
            if (className !== 'dark-theme') {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add('students-body');
    }, []);

    const code = subject.match(/\((\d+)\)/)[1];

    function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);

        return debouncedValue;
    }
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const fetchStudents = useCallback(
        async (page = currentPage, resetPage = false) => {
            if (schoolYears.length === 0) return;

            try {
                const students = await getStudents(
                    code,
                    resetPage ? 0 : page,
                    selectedLength,
                    selectedYear,
                );

                setData(students);
                setContent(students.content);
                setTotalPages(students.totalPages);

                if (resetPage) {
                    setCurrentPage(0);
                }

                const { activities } = await getSubjectActivities(code);

                activities.forEach((a) => {
                    columnFieldMap[a.shortName] = a.shortName; // npr. "K1": "K1"
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
                        }
                    });
                    return {
                        ...student,
                        ...resultMap, // dodaje K1, K2, PR sa bodovima
                    };
                });

                setContent(transformed);
                console.log('Transformed students:', transformed);
                console.log('MAPA:', columnFieldMap);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        },
        [code],
    );

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
        fetchStudents(0, true);
    }, []);

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

    const handleGenerate = () => {
        setGeneratedResults(false);
    };

    const handleSort = (column) => {
        const direction = !sortDirection[column];
        setSortDirection({ [column]: direction });

        const sorted = [...students].sort((a, b) => {
            if (a[column] < b[column]) return direction ? -1 : 1;
            if (a[column] > b[column]) return direction ? 1 : -1;
            return 0;
        });

        setStudents(sorted);
    };

    useEffect(() => {
        if (currentPage > 0) {
            fetchStudents(currentPage, false);
        }
    }, [currentPage]);

    const schoolYearChange = (event) => {
        setSelectedYear(event.target.value);
    };
    const selectedLengthChange = (event) => {
        setSelectedLength(event.target.value);
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
                <div className="subject-row">
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
                            <label key={label.name}>
                                <input
                                    type="checkbox"
                                    checked={selectedColumns.includes(
                                        label.name,
                                    )}
                                    onChange={() =>
                                        handleColumnToggle(label.name)
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
                                onChange={() => setStudentSource('fajl')}
                            />{' '}
                            prema spisku
                        </label>
                    </div>
                </div>

                <div className="selected-columns">
                    <strong>Kolone:</strong>{' '}
                    <span>{selectedColumns.join(', ')}</span>
                </div>

                <div className="generate-button-wrapper">
                    <button
                        onClick={handleGenerate}
                        className="generate-button"
                    >
                        Generiši
                    </button>
                </div>

                <div className="table-section">
                    {selectedColumns.length === 0 ? (
                        <p className="no-data">
                            Izaberite kolone koje želite da imate u tabeli
                        </p>
                    ) : (
                        <table>
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
                            <tbody hidden={generatedResults}>
                                {content
                                    .filter(
                                        (student) =>
                                            student.schoolYear === selectedYear,
                                    )
                                    .map((student, index) => (
                                        <tr key={index}>
                                            {selectedColumns.map((col) => {
                                                const field =
                                                    columnFieldMap[col]; // npr. 'firstName' za 'Ime'
                                                return (
                                                    <td key={col}>
                                                        {student[field] || ''}
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
                        onClick={() =>
                            alert('Export funkcionalnost nije implementirana.')
                        }
                    >
                        Export
                    </button>
                    <button
                        style={{
                            display: selectedColumns.length
                                ? 'inline-block'
                                : 'none',
                        }}
                        className="export-btn"
                        onClick={() =>
                            alert(
                                'Podaci su kopirani u clipboard (simulacija).',
                            )
                        }
                    >
                        Kopiraj u Clipboard
                    </button>
                </div>
            </main>
        </div>
    );
}

export default GenerateResultsForm;
