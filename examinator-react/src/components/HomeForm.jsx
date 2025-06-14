import { useState, useRef, useEffect } from 'react';
import HeaderComponent from './HeaderComponent';
import { Link } from 'react-router-dom';
import {
    addSubject,
    getUserSubjects,
    getUsersOnSubject,
    addUserToSubject,
    removeUserFromSubject,
} from '../services/SubjectManagementService';
import { getUsers } from '../services/UserService';

function HomeForm() {
    const [subjects, setSubjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [subjectUsers, setSubjectUsers] = useState([]);

    const [selectedUsername, setSelectedUsername] = useState(null);
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isProfessorDialogOpen, setProfessorDialogOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const dialogRef = useRef(null);
    const profDialogRef = useRef(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await getUserSubjects();

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
        const fetchSubjectUsers = async () => {
            if (!subjectCode) return; // ne pozivaj ako subjectId nije definisan

            try {
                const res = await getUsersOnSubject(subjectCode);

                const subjectUsers = res.map((user) => {
                    const firstName = user.firstName.trim();
                    const lastName = user.lastName.trim();
                    return {
                        id: user.id,
                        firstName: firstName,
                        lastName: lastName,
                        email: user.email,
                        username: user.username,
                    };
                });

                console.log('Učitani korisnici predmeta:', subjectUsers);
                setSubjectUsers(subjectUsers);

                const users = await getUsers();

                const availableUsers = users.filter(
                    (user) => !res.some((u) => u.id === user.id),
                );

                setUsers(availableUsers);
            } catch (err) {
                console.error(
                    'Greška pri učitavanju korisnika predmeta:',
                    err.message,
                );
            }
        };
        fetchSubjectUsers();
    }, [subjectCode, isProfessorDialogOpen]); // pozovi kad se otvori dialog ili promeni subjectId

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
        if (isProfessorDialogOpen && profDialogRef.current) {
            profDialogRef.current.showModal();
        }
        setSelectedUsername('');
    }, [isProfessorDialogOpen]);
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

    const handleAddProfessor = async () => {
        if (!selectedUsername || !subjectCode) return;

        try {
            await addUserToSubject(selectedUsername, subjectCode);
            setSubjectUsers((prevUsers) => [
                ...prevUsers,
                {
                    username: selectedUsername,
                    firstName: users.find(
                        (user) => user.username === selectedUsername,
                    ).firstName,
                    lastName: users.find(
                        (user) => user.username === selectedUsername,
                    ).lastName,
                    email: users.find(
                        (user) => user.username === selectedUsername,
                    ).email,
                },
            ]);
        } catch (err) {
            console.error('Greška pri dodavanju:', err.message);
        }
    };

    const handleRemoveProfessor = async (selectedUsername) => {
        console.log('username:', selectedUsername, 'subjectCode:', subjectCode);
        if (!selectedUsername || !subjectCode) return;

        try {
            const res = await getUsersOnSubject(subjectCode);
            if (res.length === 1) {
                console.error('Ne možete ukloniti posljednjeg predavača.');
                return;
            }
            await removeUserFromSubject(selectedUsername, subjectCode);
            setSubjectUsers((prevUsers) =>
                prevUsers.filter((user) => user.username !== selectedUsername),
            );
            setSelectedUsername('');
            console.log('Uspješno uklonjen predavač:', selectedUsername);
        } catch (err) {
            console.error('Greška pri brisanju:', err.message);
        }
    };

    const openDialog = () => {
        setDialogOpen(true);
    };
    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            setDialogOpen(false);
            setEditingIndex(null);
            setSubjectName('');
            setSubjectCode('');
        }

        if (profDialogRef.current) {
            profDialogRef.current.close();
            setProfessorDialogOpen(false);
        }
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
            }

            closeDialog();
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleIconClick = (text, index) => {
        const match = subjects[index].match(/(.+)\s+\((.+)\)/);
        if (text === 'edit') {
            if (match) {
                setSubjectName(match[1]);
                setSubjectCode(match[2]);
                setEditingIndex(index);
                setDialogOpen(true);
            }
        } else if (text === 'display_settings') {
            // window.location.href = 'activities';
        } else if (text === 'school') {
        } else if (text === 'groups') {
            if (match) {
                setSubjectCode(match[2]);
                setProfessorDialogOpen(true);
            }
        }
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
                                            <Link
                                                to="/activities"
                                                state={{ subject: subjects[i] }}
                                            >
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
                                            </Link>
                                        </td>

                                        <td>
                                            <Link
                                                to="/students"
                                                state={{ subject: subjects[i] }}
                                            >
                                                <span
                                                    className="material-icons"
                                                    onClick={() =>
                                                        handleIconClick(
                                                            'school',
                                                            i,
                                                        )
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

            <dialog
                ref={profDialogRef}
                id="professors-dialog"
                onCancel={closeDialog}
            >
                <form id="professors-form">
                    <div class="dialog-header">
                        <h3>Dodavanje predavača</h3>
                        <button
                            type="button"
                            id="close-professors-dialog"
                            class="close-btn"
                            onClick={closeDialog}
                        >
                            <span class="material-icons">close</span>
                        </button>
                    </div>

                    <div class="add-professor-row">
                        <label for="professor-select">Predavač</label>
                        <select
                            id="professor-select"
                            value={selectedUsername}
                            onChange={(e) =>
                                setSelectedUsername(e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Izaberite predavača
                            </option>
                            {users.map((user) => (
                                <option key={user.id} value={user.username}>
                                    {user.firstName} {user.lastName}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            id="add-professor"
                            onClick={handleAddProfessor}
                        >
                            Dodaj
                        </button>
                    </div>

                    {subjectUsers.length === 0 ? (
                        <p id="no-professors" className="no-data-msg">
                            Trenutno nema ni jedan predavač na predmetu
                        </p>
                    ) : (
                        <div className="professor-table-container">
                            <table id="professor-table">
                                <thead>
                                    <tr>
                                        <th>Ime</th>
                                        <th>Prezime</th>
                                        <th>Email</th>
                                        <th>Akcija</th>
                                    </tr>
                                </thead>
                                <tbody id="professor-body">
                                    {subjectUsers.map((p) => (
                                        <tr key={p.username}>
                                            <td>{p.firstName}</td>
                                            <td>{p.lastName}</td>
                                            <td>{p.email}</td>
                                            <td>
                                                <span
                                                    className="material-icons delete-professor"
                                                    onClick={() =>
                                                        handleRemoveProfessor(
                                                            p.username,
                                                        )
                                                    }
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    delete
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* <div class="buttons bottom-buttons"> */}
                    {/*     <button */}
                    {/*         type="button" */}
                    {/*         class="cancel-btn" */}
                    {/*         id="cancel-professors" */}
                    {/*         onClick={closeDialog} */}
                    {/*     > */}
                    {/*         Otkaži */}
                    {/*     </button> */}
                    {/*     <button type="submit" class="confirm-btn"> */}
                    {/*         Sačuvaj */}
                    {/*     </button> */}
                    {/* </div> */}
                </form>
            </dialog>
            {/* )} */}
        </div>
    );
}

export default HomeForm;
