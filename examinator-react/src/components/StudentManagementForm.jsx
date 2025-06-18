import HeaderComponent from "./HeaderComponent"
import { useLocation } from "react-router-dom"
import '../styles/studentManagement.scss';
import { useEffect, useCallback } from 'react'
import { getSubjectActivities } from "../services/SubjectManagementService";
import { useState } from "react";
import { getStudents, getYears } from "../services/StudentManagementService";

const StudentManagementForm = () => {

    const [data, setData] = useState([])
    const [content, setContent] = useState([])
    const [schoolYears, setSchoolYears] = useState(new Set());
    const [selectedYear, setSelectedYear] = useState(0)
    const [selectedLength, setSelectedLength] = useState(10)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
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
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchStudents = useCallback(async (page = currentPage, resetPage = false) => {
        if (schoolYears.length === 0) return;

        try {
            const formattedSearch = debouncedSearchTerm.replace(/ /g, '_');
            const students = await getStudents(
                code,
                resetPage ? 0 : page,
                selectedLength,
                'asc',
                selectedYear,
                formattedSearch
            );

            setData(students);
            setContent(students.content);
            setTotalPages(students.totalPages);

            if (resetPage) {
                setCurrentPage(0);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }, [code, currentPage, selectedLength, selectedYear, debouncedSearchTerm]);

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
    }, [debouncedSearchTerm, selectedLength, selectedYear]);

    useEffect(() => {
        if (currentPage > 0) {
            fetchStudents(currentPage, false);
        }
    }, [currentPage]);

    const schoolYearChange = (event) => {
        setSelectedYear(event.target.value)
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








    return (
        <div>
            <HeaderComponent />

            <main class="main-content students-container">
                <div class="subject-row">
                    <div class="field field-subject">
                        <label for="subject">Naziv predmeta</label>
                        <input type="text" id="subject" value={subject} readonly />
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
                                <input type="text" id="searchInput" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pretraga studenata..." />
                            </div>
                        </div>

                        <div id="studentsContainer">
                            {content.length > 0 ? (

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
                                        {content.filter(student => student.schoolYear == selectedYear).map((student) => (
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

                        <div id="paginationWrapper" >
                            <div id="paginationCenter">
                                {data.totalPages > 1 ?
                                    <div id="paginationControls">
                                        <span class="material-icons" style={{ cursor: "pointer" }} onClick={() => setCurrentPage(0)}>first_page</span>
                                        <span class="material-icons" style={{ cursor: "pointer" }} onClick={() => changePage(false)} >navigate_before</span>
                                        <div id="paginationInfo" style={{ cursor: "pointer" }}>{currentPage + 1} / {data.totalPages}</div>
                                        <span class="material-icons" style={{ cursor: "pointer" }} onClick={() => changePage()} >navigate_next</span>
                                        <span class="material-icons" style={{ cursor: "pointer" }} onClick={() => setCurrentPage(totalPages - 1)} >last_page</span>
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
        </div >
    )
}

export default StudentManagementForm
