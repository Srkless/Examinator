import { useState, useRef, useEffect } from 'react';
import HeaderComponent from './HeaderComponent';
import {
    addSubject,
    getUserSubjects,
} from '../services/SubjectManagementService';

function HomeForm() {
    const [subjects, setSubjects] = useState([]);
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const dialogRef = useRef(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await getUserSubjects(); // ČEKANJE Promise-a

                const newSubjects = res.map((item) => {
                    const name = item.name.trim();
                    const code = item.code;
                    return `${name} (${code})`;
                });

                setSubjects(newSubjects);
            } catch (err) {
                console.error('Greška:', err.message);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subjectName.trim() || !subjectCode.trim()) return;

        const name = subjectName.trim();
        const code = subjectCode.trim();
        const newSubject = `${name} (${code})`;

        try {
            await addSubject(name, code); // Poziv backendu

            if (editingIndex !== null) {
                const updatedSubjects = [...subjects];
                updatedSubjects[editingIndex] = newSubject;
                setSubjects(updatedSubjects);
            } else {
                setSubjects([...subjects, newSubject]);
            }

            closeDialog();
        } catch (error) {
            console.error(error.message);
            // Po želji možeš prikazati grešku korisniku (npr. toast ili alert)
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
            window.location.href = 'activities.html';
        } else {
            window.location.href = '.html'; // Replace accordingly
        }
    };

    return (
        <div className="home-body">
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
                                            <span
                                                className="material-icons"
                                                onClick={() =>
                                                    handleIconClick(
                                                        'display_settings',
                                                        i,
                                                    )
                                                }
                                            >
                                                display_settings
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="material-icons"
                                                onClick={() =>
                                                    handleIconClick('school', i)
                                                }
                                            >
                                                school
                                            </span>
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

            {/* {isDialogOpen && ( */}
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
            {/* )} */}
        </div>
    );
}

export default HomeForm;
