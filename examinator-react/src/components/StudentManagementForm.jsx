import HeaderComponent from "./HeaderComponent"
import { useLocation } from "react-router-dom"
import '../styles/studentManagement.scss';
import { useEffect, useCallback } from 'react'
import { useState, useRef } from "react";
import { addStudent, getStudents, getYears, updateStudent, deleteStudent } from "../services/StudentManagementService";

const StudentManagementForm = () => {

    const [data, setData] = useState([])
    const [content, setContent] = useState([])
    const [schoolYears, setSchoolYears] = useState([]);  // Changed from Set to array
    const [selectedYear, setSelectedYear] = useState(null)  // Changed to null initially
    const [selectedLength, setSelectedLength] = useState(10)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [dialogText, setDialogText] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [subjectJson, setSubjectJson] = useState('')
    const [studentName, setStudentName] = useState('')
    const [studentLastName, setStudentLastName] = useState('')
    const [studentIndex, setStudentIndex] = useState('')
    const [studentGroup, setStudentGroup] = useState('')
    const [studentNote, setStudentNote] = useState('')
    const [studentId, setStudentId] = useState('')
    const [isYearsLoaded, setIsYearsLoaded] = useState(false)  // New state to track years loading


    useEffect(() => {
        setSubjectJson({
            code: code
        })
    }, [])

    const studentDialogRef = useRef(null)

    const location = useLocation();
    const subject = location.state?.subject

    useEffect(() => {
        document.body.classList.forEach((className) => {
            if (className !== 'dark-theme') {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add('students-body');
    }, []);

    const openDialog = (ref, dText, edit = true, student = null) => {
        setDialogText(dText)
        setIsEdit(edit)

        console.log(student)
        if (student != null) {
            setStudentName(student.firstName)
            setStudentLastName(student.lastName)
            setStudentGroup(student.group)
            setStudentNote(student.note)
            setStudentIndex(student.index)
            setStudentId(student.id)
        }
        ref.current?.showModal()
    }

    const closeDialog = (ref) => {
        ref.current?.close()
        setStudentName('')
        setStudentLastName('')
        setStudentGroup('')
        setStudentNote('')
        setStudentIndex('')
        setStudentId('')
    }

    const code = subject.match(/\((\d+)\)/)[1];

    const hasNumbers = (str) => /\d/.test(str);

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

    const fetchStudents = useCallback(async (page = currentPage, resetPage = false) => {
        // Don't fetch if years aren't loaded yet or no year is selected
        if (!isYearsLoaded || selectedYear === null) return;


        try {
            let formattedSearch = debouncedSearchTerm.replace(/ /g, '_');
            let indexSearchTerm = ''
            if (hasNumbers(formattedSearch)) {
                console.log("ima brojeva")
                indexSearchTerm = formattedSearch
                formattedSearch = ''
            }

            const students = await getStudents(
                code,
                resetPage ? 0 : page,
                selectedLength,
                'asc',
                selectedYear,
                formattedSearch,
                indexSearchTerm
            );

            console.log(students)
            setData(students);
            setContent(students.content);
            setTotalPages(students.totalPages);

            if (resetPage) {
                setCurrentPage(0);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }, [code, currentPage, selectedLength, selectedYear, debouncedSearchTerm, isYearsLoaded]);

    useEffect(() => {
        const fetchYears = async () => {
            if (!code) return;

            try {
                const years = await getYears(code);
                const validYears = years.filter(item => !isNaN(item));
                if (validYears.length == 0) {
                    const month = new Date().getMonth();
                    const newYear = new Date().getFullYear()
                    if (month < 5) {
                        validYears.push(newYear - 1)
                    } else {
                        validYears.push(newYear)
                    }
                } else {
                    validYears.push(validYears[0] + 1)
                }
                console.log(validYears)

                validYears.sort((a, b) => b - a)
                setSchoolYears(validYears);

                if (validYears.length > 0) {
                    setSelectedYear(validYears[0]);
                }
                setIsYearsLoaded(true);
            } catch (error) {
                console.error('Error fetching years:', error);
                setIsYearsLoaded(true);
            }
        };

        fetchYears();
    }, [code]);

    useEffect(() => {
        if (isYearsLoaded && selectedYear !== null) {
            fetchStudents(0, true);
        }
    }, [debouncedSearchTerm, selectedLength, selectedYear, isYearsLoaded]);

    useEffect(() => {
        if (currentPage > 0 && isYearsLoaded && selectedYear !== null) {
            fetchStudents(currentPage, false);
        }
    }, [currentPage]);

    const schoolYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value))
    }

    const selectedLengthChange = (event) => {
        setSelectedLength(event.target.value)
    }

    const changePage = (next = true) => {
        if (next === true) {
            if ((currentPage + 1) != totalPages) {
                setCurrentPage(currentPage + 1)
            }
        } else {
            if (currentPage != 0) {
                setCurrentPage(currentPage - 1)
            }

        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteStudent(id)
            fetchStudents(currentPage, false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isEdit) {
            console.log('edit mode')
            try {
                await updateStudent(studentId, studentIndex, selectedYear, studentName, studentLastName, studentGroup, studentNote, subjectJson)
                closeDialog(studentDialogRef)
                fetchStudents(currentPage, false)
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                await addStudent(studentIndex, selectedYear, studentName, studentLastName, studentGroup, studentNote, subjectJson);
                closeDialog(studentDialogRef)
                fetchStudents(currentPage, false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div>
            <HeaderComponent />

            <main className="main-content students-container">
                <div className="subject-row">
                    <div className="field field-subject">
                        <label htmlFor="subject">Naziv predmeta</label>
                        <input type="text" id="subject" value={subject} readOnly />
                    </div>

                    <div className="field field-year">
                        <label htmlFor="schoolYear">Školska godina</label>
                        <select id="schoolYear" onChange={schoolYearChange} value={selectedYear || ''}>
                            {schoolYears.map(year => (
                                <option key={year} value={year}>{year}/{year + 1}</option>
                            ))}
                        </select>
                    </div>

                    <div className="student-buttons">
                        <button id="importStudents" data-tooltip="Uvezi spisak studenata">
                            <span className="material-icons">upload</span>
                        </button>
                        <button id="addStudentBtn" data-tooltip="Dodaj studenta" onClick={() => openDialog(studentDialogRef, 'Dodavanje novog studenta na predmet', false)}>
                            <span className="material-icons">person_add</span>
                        </button>
                    </div>
                </div>

                <section>
                    <section>
                        <div className="section-header">
                            <h2>Studenti</h2>
                            <div className="search-bar">
                                <input type="text" id="searchInput" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pretraga studenata..." />
                            </div>
                        </div>

                        <div id="studentsContainer">
                            {!isYearsLoaded ? (
                                <p className="no-data">Učitavanje...</p>
                            ) : content.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Indeks</th>
                                            <th>Ime</th>
                                            <th>Prezime</th>
                                            <th>Grupa</th>
                                            <th>Napomena</th>
                                            <th className='action-column'>
                                                Akcija
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {content.map((student) => (
                                            <tr key={student.id}>
                                                <td>{student.index}</td>
                                                <td>{student.firstName}</td>
                                                <td>{student.lastName}</td>
                                                <td>{student.group}</td>
                                                <td>{student.note}</td>
                                                <td className='action-column'>
                                                    <span className="material-icons" onClick={() => openDialog(studentDialogRef, 'Izmjena podataka o studentu', true, student)}>edit</span>
                                                    <span className="material-icons" onClick={() => handleDelete(student.id)}>delete</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="no-data">Trenutno nema ni jednog studenta na predmetu</p>
                            )}
                        </div>

                        <div id="paginationWrapper" >
                            <div id="paginationCenter">
                                {data.totalPages > 1 ?
                                    <div id="paginationControls">
                                        <span className="material-icons" style={{ cursor: "pointer" }} onClick={() => setCurrentPage(0)}>first_page</span>
                                        <span className="material-icons" style={{ cursor: "pointer" }} onClick={() => changePage(false)} >navigate_before</span>
                                        <div id="paginationInfo" style={{ cursor: "pointer" }}>{currentPage + 1} / {data.totalPages}</div>
                                        <span className="material-icons" style={{ cursor: "pointer" }} onClick={() => changePage()} >navigate_next</span>
                                        <span className="material-icons" style={{ cursor: "pointer" }} onClick={() => setCurrentPage(totalPages - 1)} >last_page</span>
                                    </div>
                                    :
                                    <div id="paginationControls">
                                        <div id="paginationInfo">1 / 1</div>
                                    </div>
                                }
                            </div>

                            <select id="rowsPerPage" onChange={selectedLengthChange} value={selectedLength}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                        </div>

                    </section>
                </section>
            </main>
            <dialog ref={studentDialogRef} id="studentDialog" onCancel={() => closeDialog(studentDialogRef)}>
                <form method="dialog" id="studentForm" onSubmit={handleSubmit}>
                    <div className="dialog-header">
                        <h3>{dialogText}</h3>
                        <button type="button" className="close-btn" id="closeStudentDialog" onClick={() => closeDialog(studentDialogRef)}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    <label>Ime *</label>
                    <input type="text" name="ime" required value={studentName} onChange={(e) => setStudentName(e.target.value)} />

                    <label>Prezime *</label>
                    <input type="text" name="prezime" required value={studentLastName} onChange={(e) => setStudentLastName(e.target.value)} />

                    <label>Indeks</label>
                    <input type="text" name="indeks" value={studentIndex} onChange={(e) => setStudentIndex(e.target.value)} />

                    <label>Grupa</label>
                    <input type="text" name="grupa" value={studentGroup} onChange={(e) => setStudentGroup(e.target.value)} />

                    <label>Napomena</label>
                    <textarea name="napomena" value={studentNote} onChange={(e) => setStudentNote(e.target.value)}></textarea>

                    <div className="buttons">
                        <button type="button" className="cancel-btn" onClick={() => closeDialog(studentDialogRef)}>Otkaži</button>
                        <button type="submit" className="confirm-btn">Sačuvaj</button>
                    </div>
                </form>
            </dialog>
        </div >
    )
}

export default StudentManagementForm
