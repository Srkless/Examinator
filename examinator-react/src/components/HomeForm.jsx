import { useState, useRef, useEffect } from 'react';
import HeaderComponent from './HeaderComponent';
import { Link, useNavigate } from 'react-router-dom';
import {
    addSubject,
    getUserSubjects,
} from '../services/SubjectManagementService';

function HomeForm() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [rawSubjects, setRawSubjects] = useState([]);
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isResultsDialogOpen, setResultsDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(null);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('');

    const dialogRef = useRef(null);
    const resultsDialogRef = useRef(null);

    const selectedSubject = rawSubjects[selectedSubjectIndex] || {};

    const activitySchoolYears = Array.from(
        new Set(selectedSubject.activities?.map(activity => activity.schoolYear))
    ).sort((a, b) => b - a);

    const filteredActivities = selectedSubject.activities?.filter(
        activity => selectedSchoolYear ? activity.schoolYear == selectedSchoolYear : true
    ) || [];

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await getUserSubjects();
                if (!res) return;

                setRawSubjects(res);

                const newSubjects = res.map((item) => {
                    const name = item.name.trim();
                    const code = item.code;
                    return `${name} (${code})`;
                });

                setSubjects(newSubjects);
            } catch (err) {
                console.error('Greška u fetchSubjects:', err.message);
            }
        };

        fetchSubjects();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-icon')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isDialogOpen && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [isDialogOpen]);

    useEffect(() => {
        if (isResultsDialogOpen && resultsDialogRef.current) {
            resultsDialogRef.current.showModal();
        }
    }, [isResultsDialogOpen]);

    useEffect(() => {
        document.body.classList.forEach((className) => {
            if (className !== 'dark-theme') {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add('home-body');
    }, []);

    const handleAddClick = () => {
        setSubjectName('');
        setSubjectCode('');
        setEditingIndex(null);
        setDialogOpen(true);
    };

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        setEditingIndex(null);
        setSubjectName('');
        setSubjectCode('');
    };

    const openResultsDialog = (subjectIndex) => {
        setSelectedSubjectIndex(subjectIndex);


        const subject = rawSubjects[subjectIndex];
        const schoolYears = Array.from(
            new Set(subject?.activities?.map(activity => activity.schoolYear))
        ).sort((a, b) => b - a);

        const newestYear = schoolYears[0] || '';
        setSelectedSchoolYear(newestYear);
        setSelectedActivity('');
        setResultsDialogOpen(true);
    };

    const closeResultsDialog = () => {
        setResultsDialogOpen(false);
        if (resultsDialogRef.current) {
            resultsDialogRef.current.close();
        }
        setSelectedSubjectIndex(null);
        setSelectedSchoolYear('');
        setSelectedActivity('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subjectName.trim() || !subjectCode.trim()) return;

        const name = subjectName.trim();
        const code = subjectCode.trim();
        const newSubject = `${name} (${code})`;

        try {
            await addSubject(name, code);

            if (editingIndex !== null) {
                const updatedSubjects = [...subjects];
                updatedSubjects[editingIndex] = newSubject;
                setSubjects(updatedSubjects);
            } else {
                setSubjects([...subjects, newSubject]);

                const newRawSubject = { name, code, activities: [] };
                setRawSubjects([...rawSubjects, newRawSubject]);
            }

            closeDialog();
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleResultsSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSchoolYear || !selectedActivity) return;

        try {

            navigate('/results', {
                state: {
                    subject: subjects[selectedSubjectIndex],
                    selectedSchoolYear: selectedSchoolYear,
                    selectedActivity: selectedActivity
                }
            });

            closeResultsDialog();
        } catch (error) {
            console.error('Error navigating to results:', error.message);
        }
    };

    const handleIconClick = (text, index) => {
        if (text === 'edit') {
            const match = subjects[index].match(/(.+)\s+\((.+)\)/);
            if (match) {
                setSubjectName(match[1]);
                setSubjectCode(match[2]);
                setEditingIndex(index);
                setDialogOpen(true);
            }
        } else if (text === 'display_settings') {

        } else if (text === 'school') {
        } else if (text === 'grid_on') {
            openResultsDialog(index);
        } else {
            window.location.href = '.html';
        }
    };


    const handleSchoolYearChange = (e) => {
        setSelectedSchoolYear(e.target.value);
        setSelectedActivity('');
    };

    return (
        <div>
            <HeaderComponent />
            <main className="main-content">
                {subjects.length > 0 ? (
                    <>
                        <h2>Predmeti</h2>
                        <table>
                            <tbody>
                                {subjects.map((subj, i) => (
                                    <tr key={i}>
                                        <td>{subj}</td>
                                        <td>
                                            <span
                                                className="material-icons"
                                                onClick={() =>
                                                    handleIconClick('edit', i)
                                                }
                                            >
                                                edit
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="material-icons"
                                                onClick={() =>
                                                    handleIconClick('groups', i)
                                                }
                                            >
                                                groups
                                            </span>
                                        </td>
                                        <td>
                                            <Link to='/activities' state={{ subject: subjects[i] }}>
                                                <span
                                                    className="material-icons"
                                                    onClick={() => handleIconClick('display_settings', i)}
                                                >
                                                    display_settings
                                                </span>
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to='/students' state={{ subject: subjects[i] }}>
                                                <span
                                                    className="material-icons"
                                                    onClick={() =>
                                                        handleIconClick('school', i)
                                                    }
                                                >
                                                    school
                                                </span>
                                            </Link>
                                        </td>
                                        <td>
                                            <span
                                                className="material-icons"
                                                onClick={() =>
                                                    handleIconClick(
                                                        'description',
                                                        i,
                                                    )
                                                }
                                            >
                                                description
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="material-icons"
                                                onClick={() =>
                                                    handleIconClick(
                                                        'grid_on',
                                                        i,
                                                    )
                                                }
                                            >
                                                grid_on
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p id="no-subjects">Trenutno nemate ni jedan predmet</p>
                )}
            </main>

            <button className="add-button" onClick={handleAddClick}>
                <span className="material-icons">add</span>
            </button>

            {/* Subject Add/Edit Dialog */}
            <dialog ref={dialogRef} id="dialog" onCancel={closeDialog}>
                <form id="subject-form" onSubmit={handleSubmit}>
                    <div className="dialog-header">
                        <h3 id="dialog-title">
                            {editingIndex !== null
                                ? 'Izmjena osnovnih podataka o predmetu'
                                : 'Dodavanje novog predmeta'}
                        </h3>
                        <button
                            type="button"
                            id="close-dialog"
                            className="close-btn"
                            onClick={closeDialog}
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                    <label>
                        Naziv predmeta
                        <input
                            type="text"
                            id="subject-name"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Šifra predmeta
                        <input
                            type="text"
                            id="subject-code"
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}
                            required
                        />
                    </label>
                    <div className="buttons">
                        <button
                            type="button"
                            onClick={closeDialog}
                            id="cancel-btn"
                        >
                            Odustani
                        </button>
                        <button type="submit">Potvrdi</button>
                    </div>
                </form>
            </dialog>

            {/* Results Dialog */}
            <dialog ref={resultsDialogRef} id="results-dialog" onCancel={closeResultsDialog}>
                <form id="results-form" onSubmit={handleResultsSubmit}>
                    <div className="dialog-header">
                        <h3 id="results-dialog-title">
                            Dodavanje rezultata
                            {selectedSubjectIndex !== null && (
                                <span>
                                    {' - '}
                                    {rawSubjects[selectedSubjectIndex]?.name} ({rawSubjects[selectedSubjectIndex]?.code})
                                </span>
                            )}
                        </h3>
                        <button
                            type="button"
                            id="close-results-dialog"
                            className="close-btn"
                            onClick={closeResultsDialog}
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    {/* Show School Year selection first */}
                    <label>
                        Školska godina
                        <select
                            id="school-year"
                            value={selectedSchoolYear}
                            onChange={handleSchoolYearChange}
                            required
                        >
                            <option value="">Izaberite školsku godinu</option>
                            {activitySchoolYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Show Activity selection second, only after school year is selected */}
                    <label>
                        Aktivnost
                        <select
                            id="activity"
                            value={selectedActivity}
                            onChange={(e) => setSelectedActivity(e.target.value)}
                            required
                            disabled={!selectedSchoolYear}
                        >
                            <option value="">
                                {selectedSchoolYear ? "Izaberite aktivnost" : "Prvo izaberite školsku godinu"}
                            </option>
                            {filteredActivities.map((activity) => (
                                <option key={activity.id} value={activity.name}>
                                    {activity.name} ({activity.maxPoints} poena)
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="buttons">
                        <button
                            type="button"
                            onClick={closeResultsDialog}
                            id="cancel-results-btn"
                        >
                            Otkaži
                        </button>
                        <button type="submit">Potvrdi</button>
                    </div>
                </form>
            </dialog>
        </div>
    );
}

export default HomeForm;
