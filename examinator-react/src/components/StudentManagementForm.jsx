import HeaderComponent from "./HeaderComponent"
import { useLocation } from "react-router-dom"
import '../styles/studentManagement.scss';
import { useEffect } from 'react'
import { getSubjectActivities } from "../services/SubjectManagementService";
import { useState } from "react";

const StudentManagementForm = () => {

    const [subjectData, setSubjectData] = useState([]);
    const [subjectStudents, setSubjectStudents] = useState([]);
    const [schoolYears, setSchoolYears] = useState(new Set());
    const [selectedYear, setSelectedYear] = useState(0)
    const location = useLocation();
    const subject = location.state?.subject
    console.log(subject)

    useEffect(() => {
        document.body.classList.forEach((className) => {
            if (className !== 'dark-theme') {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add('students-body');
    }, []);



    const code = subject.match(/\((\d+)\)/)[1];


    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const subjectData = await getSubjectActivities(code);
                setSubjectData(subjectData);
                setSubjectStudents(subjectData.studentSubjects)
            } catch (error) {
                console.log('Error fetching subject data: ', error)

            }
        };
        fetchStudents();
        console.log(subjectData)
    }, [code])

    useEffect(() => {
        setSchoolYears([... new Set(subjectStudents.map(student => student.schoolYear))].sort((a, b) => b - a));
    }, [subjectStudents])

    useEffect(() => {
        setSelectedYear(schoolYears[0])
    }, [schoolYears])


    const schoolYearChange = (event) => {
        setSelectedYear(event.target.value)
    }



    return (
        <div>
            <HeaderComponent />

            <main class="main-content students-container">
                <div class="subject-row">
                    <div class="field field-subject">
                        <label for="subject">Naziv predmeta</label>
                        <input type="text" id="subject" value={subjectData.name} readonly />
                    </div>

                    <div class="field field-year">
                        <label for="schoolYear">Školska godina</label>
                        <select id="schoolYear" onChange={schoolYearChange}>
                            {Array.from(schoolYears).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div class="student-buttons">
                        <button id="importStudents" data-tooltip="Uvezi spisak studenata">
                            <span class="material-icons">upload</span>
                        </button>
                        <button id="addStudentBtn" data-tooltip="Dodaj studenta">
                            <span class="material-icons">person_add</span>
                        </button>
                    </div>
                </div>

                <section>
                    <section>
                        <div class="section-header">
                            <h2>Studenti</h2>
                            <div class="search-bar">
                                <input type="text" id="searchInput" placeholder="Pretraga studenata..." />
                            </div>
                        </div>

                        <div id="studentsContainer">
                            {subjectStudents.length > 0 ? (

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
                                        {subjectStudents.filter(student => student.schoolYear == selectedYear).map((student, i) => (
                                            <tr>
                                                <td>{student.index}</td>
                                                <td>{student.firstName}</td>
                                                <td>{student.lastName}</td>
                                                <td>{student.group}</td>
                                                <td>{student.note}</td>
                                                <td className='action-column'>
                                                    <span className="material-icons">edit</span>
                                                    <span className="material-icons">delete</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p class="no-data">Trenutno nema ni jednog studenta na predmetu</p>
                            )}
                        </div>

                        <div id="paginationWrapper" class="hidden">
                            <div id="paginationCenter">
                                <div id="paginationControls"></div>
                                <div id="paginationInfo">1 / 1</div>
                            </div>

                            <select id="rowsPerPage">
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
        </div>
    )
}

export default StudentManagementForm
