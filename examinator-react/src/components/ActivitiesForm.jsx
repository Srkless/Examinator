import { useLocation } from "react-router-dom"
import { getSubjectActivities } from "../services/SubjectManagementService";
import { useState, useEffect, use, useRef } from 'react'
import HeaderComponent from "./HeaderComponent";

import '../styles/activities.scss';
import { addActivity, deleteActivity, updateActivity } from "../services/ActivityService";

function ActivitiesForm() {

    useEffect(() => {
        document.body.classList.forEach((className) => {
            if (className !== 'dark-theme') {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add('activities-body');
    }, []);



    const [activities, setActivities] = useState([])
    const [formulas, setFormulas] = useState([])

    const [activityDialogOpen, setActivityDialogOpen] = useState(false)
    const [formulaDialogOpen, setFormulaDialogOpen] = useState(false)
    const [schoolYears, setSchoolYears] = useState(new Set())
    const [selectedYear, setSelectedYear] = useState(0)
    const [subjectJson, setSubjectJson] = useState('')
    const [activityId, setActivityId] = useState('')
    const [activityName, setActivityName] = useState('')
    const [activityShortName, setActivityShortName] = useState('')
    const [activityMaxPoints, setActivityMaxPoints] = useState('')
    const [subjectId, setSubjectId] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [editingActivity, setEditingActivity] = useState(null)
    const [warningDialogText, setWarningDialogText] = useState('')



    const activityDialogRef = useRef(null)
    const formulaDialogRef = useRef(null)
    const warningDialogRef = useRef(null)
    const subjectRef = useRef(null)

    const openDialog = (ref) => {
        ref.current?.showModal()
    }
    const closeDialog = (ref) => {
        ref.current?.close();
        const form = ref.current?.querySelector('form')
        if (form) {
            form.reset();
        }
        setIsEdit(false)
        setIsDelete(false)
        setEditingActivity(null)
    }
    const openActivityDialog = (activity = null) => {

        if (activity) {
            setIsEdit(true);
            setEditingActivity(activity)
            setActivityId(activity.id)
            setActivityName(activity.name)
            setActivityShortName(activity.shortName)
            setActivityMaxPoints(activity.maxPoints)
        } else {
            setIsEdit(false)
            setEditingActivity(null)
            setActivityId('')
            setActivityName('')
            setActivityShortName('')
            setActivityMaxPoints('')
        }
        activityDialogRef.current?.showModal()
    }


    const openWarningDialog = (activity) => {
        setEditingActivity(activity)
        setIsDelete(true)

        if (activity.results.length === 0) {
            console.log('nema rezultata za ovu aktivnost')
        } else console.log('ima rezultata')
        warningDialogRef.current?.showModal();

    }



    const location = useLocation()
    const subject = location.state?.subject


    // const code =
    const code = subject.match(/\((\d+)\)/)[1];

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const act = await getSubjectActivities(code);
                setActivities(act.activities);
                setFormulas(act.formulas)
                setSubjectJson({
                    id: act.id,
                    name: act.name,
                    code: act.code
                });
                setSubjectId(act.id);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, [code]); // Include 'code' since it's used inside the effect
    useEffect(() => {

        subjectRef.current.value = subject
    }, [])

    useEffect(() => {
        setSchoolYears([...new Set(activities.map(activity => activity.schoolYear))].sort((a, b) => b - a))
    }, [activities])

    useEffect(() => {
        setSelectedYear(schoolYears[0])
    }, [schoolYears])




    const schoolYearChange = (event) => {
        setSelectedYear(event.target.value)
    }

    const handleIconClick = (activity = null, formula = null, update = false) => {

        if (activity && update) {
            openActivityDialog(activity)
            return
        } else {
            if (activity.results.length !== 0) {


                setWarningDialogText(`Neki studenti imaju već unesene bodove za ovu aktivnost.\nAko nastavite, svi bodovi će biti trajno obrisani.`);
            } else setWarningDialogText("Jeste li sigurni?")
            openWarningDialog(activity)

        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isEdit) {
                await updateActivity(activityId, activityName, activityShortName, activityMaxPoints, selectedYear, subjectJson)
                const updatedActivites = [...activities]
                setActivities(prev => prev.map(act =>
                    act.id === editingActivity.id
                        ? { ...act, name: activityName, shortName: activityShortName, maxPoints: parseInt(activityMaxPoints) }
                        : act
                ))


            } else if (isDelete) {
                await deleteActivity(editingActivity.id)
                setActivities(prev =>
                    prev.filter(act => act.id !== editingActivity.id) // Remove only after success
                );
                closeDialog(warningDialogRef)
            } else {

                console.log(subjectId)
                await addActivity(activityName, activityShortName, activityMaxPoints, selectedYear, subjectJson);
            }



            // closeDialog(activityDialogRef)

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div>
            <HeaderComponent />

            <main className="main-content activities-container">
                <div className="subject-row">
                    <div className="field field-subject">
                        <label for="subject">Naziv predmeta</label>
                        <input ref={subjectRef} type="text" id="subject" readOnly />

                    </div>

                    <div className="field field-year">
                        <label for="schoolYear">Školska godina</label>
                        <select id="schoolYear" onChange={schoolYearChange}>
                            {Array.from(schoolYears).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <section>
                    <div className="section-header">
                        <h2>Aktivnosti</h2>
                        <button id="addActivityBtn" className="add-activity-button" onClick={() => openDialog(activityDialogRef)}>Nova aktivnost</button>
                    </div>
                    <div id="activitiesContainer">
                        {activities.length > 0 ? (
                            <table className="activities-page-table">

                                <thead>
                                    <tr>
                                        <th>Skraceni naziv</th>
                                        <th>Naziv</th>
                                        <th>Maks. bodova</th>
                                        <th className="action-column">Akcija</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.filter(activity => activity.schoolYear == selectedYear).map((activity, i) => (
                                        <tr>
                                            <td>{activity.shortName}</td>
                                            <td>{activity.name}</td>
                                            <td>{activity.maxPoints}</td>
                                            <td className="action-column">
                                                <span className="material-icons" onClick={() => handleIconClick(activity, update)}>edit</span>
                                                <span className="material-icons" onClick={() => handleIconClick(activity)}>delete</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">Trenutno nemate ni jednu aktivnost na predmetu</p>

                        )}
                    </div>
                </section>

                <section className="formule-section">
                    <div className="section-header">
                        <h2>Formule</h2>
                        <button id="addFormulaBtn" className="add-activity-button" onClick={() => openDialog(formulaDialogRef)}>Nova formula</button>
                    </div>
                    <div id="formulasContainer">
                        {formulas.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Naziv</th>
                                        <th>Izraz</th>
                                        <th className="action-column">Akcija</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formulas.filter(formula => formula.schoolYear == selectedYear).map(formula => (
                                        <tr>
                                            <td>{formula.name}</td>
                                            <td>{formula.expression}</td>
                                            <td className="action-column">
                                                <span className="material-icons">edit</span>
                                                <span className="material-icons">delete</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">Trenutno nemate ni jednu formulu na predmetu</p>

                        )}
                    </div>
                </section>
            </main>

            <dialog id="activityDialog" ref={activityDialogRef}>
                <form method="dialog" id="activityForm" onSubmit={handleSubmit}>
                    <div className="dialog-header">
                        <h3>Dodavanje nove aktivnosti</h3>
                        <button type="button" id="closeActivityDialog" className="close-btn" onClick={() => closeDialog(activityDialogRef)}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                    <label>Naziv aktivnosti</label>
                    <input type="text" name="naziv" required value={activityName} onChange={(e) => setActivityName(e.target.value)} />
                    <label>Skraćeni naziv aktivnosti</label>
                    <input type="text" name="skrNaziv" required value={activityShortName} onChange={(e) => setActivityShortName(e.target.value)} />
                    <label>Maks. broj bodova</label>
                    <input type="number" name="maxBodova" min="0" required value={activityMaxPoints} onChange={(e) => setActivityMaxPoints(e.target.value)} />
                    <div className="buttons">
                        <button type="button" className="cancel-btn" onClick={() => closeDialog(activityDialogRef)}>Otkaži</button>
                        <button type="submit" className="confirm-btn">Sačuvaj</button>
                    </div>
                </form>
            </dialog>

            <dialog id="formulaDialog" ref={formulaDialogRef} onCancel={() => closeDialog(formulaDialogRef)}>
                <form method="dialog" id="formulaForm">
                    <div className="dialog-header">
                        <h3>Dodavanje nove formule</h3>
                        <button type="button" id="closeFormulaDialog" className="close-btn" onClick={() => closeDialog(formulaDialogRef)}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                    <label>Naziv</label>
                    <input type="text" name="naziv" required />
                    <label>Izraz</label>
                    <textarea name="izraz" required></textarea>
                    <div className="inline-buttons">
                        <span>Aktivnosti</span>
                        <div className="group" id="activityTags"></div>
                    </div>
                    <div className="inline-buttons">
                        <span>Operatori</span>
                        <div className="group" id="operators">
                            <button type="button">+</button>
                            <button type="button">*</button>
                            <button type="button">&lt;</button>
                            <button type="button">&gt;</button>
                            <button type="button">AND</button>
                            <button type="button">OR</button>
                        </div>
                    </div>
                    <div className="buttons">
                        <button type="button" className="cancel-btn" onClick={() => closeDialog(formulaDialogRef)}>Otkaži</button>
                        <button type="submit" className="confirm-btn">Sačuvaj</button>
                    </div>
                </form>
            </dialog>

            <dialog ref={warningDialogRef} id="warningDialog" className="warning-dialog" onCancel={() => closeDialog(warningDialogRef)}>
                <form className="warning-form" onSubmit={handleSubmit} >
                    <div className="dialog-header">
                        <h3>Upozorenje</h3>
                        <button type="button" id="closeWarningDialog" className="close-btn" onClick={() => closeDialog(warningDialogRef)} >
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    <div className="warning-content">
                        <span className="material-icons warning-icon">warning</span>
                        <p style={{ whiteSpace: 'pre-line' }}>{warningDialogText}</p>
                    </div>

                    <div className="buttons">
                        <button type="button" className="cancel-btn" id="cancelWarning" onClick={() => closeDialog(warningDialogRef)} >Otkaži</button>
                        <button type="submit" className="confirm-btn" id="confirmDelete">Nastavi</button>
                    </div>
                </form>
            </dialog>
        </div >
    )
}
export default ActivitiesForm
