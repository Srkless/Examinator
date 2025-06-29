import { useLocation } from "react-router-dom"
import { getSubjectActivities } from "../services/SubjectManagementService";
import { useState, useEffect, use, useRef } from 'react'
import HeaderComponent from "./HeaderComponent";

import '../styles/activities.scss';
import { addActivity, deleteActivity, getYears, updateActivity } from "../services/ActivityService";
import { addFormula, deleteFormula, updateFormula } from "../services/FormulaService";

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

    const [schoolYears, setSchoolYears] = useState(new Set())
    const [selectedYear, setSelectedYear] = useState(0)
    const [subjectJson, setSubjectJson] = useState('')
    const [activityId, setActivityId] = useState('')
    const [activityName, setActivityName] = useState('')
    const [activityShortName, setActivityShortName] = useState('')
    const [activityMaxPoints, setActivityMaxPoints] = useState('')
    const [isEditActivity, setIsEditActivity] = useState(false)
    const [isDeleteActivity, setIsDeleteActivity] = useState(false)
    const [isEditFormula, setIsEditFormula] = useState(false)
    const [isDeleteFormula, setIsDeleteFormula] = useState(false)
    const [editingActivity, setEditingActivity] = useState(null)
    const [editingFormula, setEditingFormula] = useState(null)
    const [warningDialogText, setWarningDialogText] = useState('')
    const [formulaExpression, setFormulaExpression] = useState('')
    const [formulaName, setFormulaName] = useState('')
    const [reload, setReload] = useState(false)
    const [activityDialogText, setActivityDialogText] = useState('Dodavanje nove aktivnosti')
    const [formulaDialogText, setFormulaDialogText] = useState('Dodavanje nove formule')



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

    }
    const openActivityDialog = () => {
        setIsEditActivity(false)
        setEditingActivity(null)
        setActivityId('')
        setActivityName('')
        setActivityShortName('')
        setActivityMaxPoints('')
        setActivityDialogText('Dodavanje nove aktivnosti')
        activityDialogRef.current?.showModal()
    }

    const openFormulaDialog = () => {
        setIsEditFormula(false)
        setEditingFormula(null)
        setFormulaName('')
        setFormulaExpression('')
        setFormulaDialogText("Dodavanje nove formule")
        formulaDialogRef.current?.showModal()
    }


    const handleActivityClick = (activity = null, update = true) => {

        if (update) {
            setIsEditActivity(true)
            setIsDeleteActivity(false)
            setEditingActivity(activity)
            setActivityId(activity.id)
            setActivityName(activity.name)
            setActivityShortName(activity.shortName)
            setActivityMaxPoints(activity.maxPoints)
            setActivityDialogText("Uređivanje aktivnosti")
            activityDialogRef.current?.showModal()
        } else {
            setIsDeleteActivity(true)
            setEditingActivity(activity)
            if (activity.results.length !== 0) {

                setWarningDialogText(`Neki studenti imaju već unesene bodove za ovu aktivnost.\nAko nastavite, svi bodovi će biti trajno obrisani.`)
            } else {
                setWarningDialogText("Jeste li sigurni ?")
            }
            openWarningDialog(activity, null)
        }
    }

    const handleFormulaClick = (formula = null, update = true) => {
        if (update) {
            setIsEditFormula(true)
            setIsDeleteFormula(false)
            setEditingFormula(formula)
            setFormulaName(formula.name)
            setFormulaExpression(formula.expression)
            setFormulaDialogText("Uređivanje formule")
            formulaDialogRef.current?.showModal()
        } else {
            setEditingFormula(formula)
            setIsDeleteFormula(true)
            setWarningDialogText("Jeste li sigurni ?")

            openWarningDialog(null, formula)
        }
    }


    const openWarningDialog = (activity = null, formula = null) => {
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
        setReload(false)
    }, [code, reload]); // Include 'code' since it's used inside the effect


    useEffect(() => {

        const fetchYears = async () => {
            try {

                const years = await getYears(code)
                console.log(years)
                if (years.length == 0) {
                    const month = new Date().getMonth();
                    const newYear = new Date().getFullYear()
                    if (month < 5) {
                        years.push(newYear - 1)
                    } else {
                        years.push(newYear)
                    }
                } else {
                    years.push(years[0] + 1)
                }

                years.sort((a, b) => b - a)
                setSchoolYears(years)
            } catch (error) {
                console.log(error)
            }
        }
        fetchYears()
    }, [code])

    useEffect(() => {
        subjectRef.current.value = subject
    })

    // useEffect(() => {
    //     const years = [...new Set(activities.map(activity => activity.schoolYear))].sort((a, b) => b - a)
    //     if (years.length == 0) {
    //         const month = new Date().getMonth();
    //         const newYear = new Date().getFullYear()
    //         if (month < 5) {
    //             years.push(newYear - 1)
    //         } else {
    //             years.push(newYear)
    //         }
    //     } else {
    //         years.push(years[0] + 1)
    //     }
    //
    //     years.sort((a, b) => b - a)
    //     setSchoolYears(years)
    // }, [activities])

    useEffect(() => {
        if (schoolYears.length > 0) {
            setSelectedYear(schoolYears[1])
        }
    }, [schoolYears])

    const schoolYearChange = (event) => {
        setSelectedYear(event.target.value)
    }

    // const handleIconClick = (activity = null, formula = null, update = false) => {
    //
    //     if (activity && update) {
    //         openActivityDialog(activity)
    //         return
    //     } else {
    //         if (activity.results.length !== 0) {
    //
    //
    //             setWarningDialogText(`Neki studenti imaju već unesene bodove za ovu aktivnost.\nAko nastavite, svi bodovi će biti trajno obrisani.`);
    //         } else setWarningDialogText("Jeste li sigurni?")
    //         openWarningDialog(activity)
    //     }
    //     if (formula && update) {
    //
    //     }
    //
    // }

    const handleSubmitActivity = async (e) => {
        e.preventDefault()
        try {
            if (isEditActivity) {
                try {
                    await updateActivity(activityId, activityName, activityShortName, activityMaxPoints, selectedYear, subjectJson)
                    setIsEditActivity(false)
                    setIsDeleteActivity(false)
                    setEditingActivity(null)

                } catch (error) {
                    console.log(error)
                }

                setReload(true)
                closeDialog(activityDialogRef)

            } else if (isDeleteActivity) {
                try {
                    await deleteActivity(editingActivity.id)
                    setIsEditActivity(false)
                    setIsDeleteActivity(false)
                    setEditingActivity(null)
                } catch (error) {
                    console.log(error)
                }
                setReload(true)
                closeDialog(warningDialogRef)
            } else {
                try {
                    await addActivity(activityName, activityShortName, activityMaxPoints, selectedYear, code);
                    setIsEditActivity(false)
                    setIsDeleteActivity(false)
                    setEditingActivity(null)
                } catch (error) {
                    console.log(error)
                }
                setReload(true)
                closeDialog(activityDialogRef)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleSubmitFormula = async (e) => {

        e.preventDefault();
        try {

            if (isEditFormula) {
                console.log('edit formula')

                try {

                    await updateFormula(editingFormula.id, formulaName, formulaExpression, selectedYear, subjectJson)
                    closeDialog(formulaDialogRef)
                    setIsEditFormula(false)
                    setEditingFormula(null)
                    setIsDeleteFormula(false)
                } catch (error) {
                    console.log(error)
                }
                setReload(true)
            } else if (isDeleteFormula) {
                console.log('delete formula')
                try {
                    await deleteFormula(editingFormula.id)
                    setIsEditFormula(false)
                    setEditingFormula(null)
                    setIsDeleteFormula(false)
                } catch (error) {
                    console.log(error)
                }
                setReload(true)
                closeDialog(warningDialogRef)
            } else {
                try {
                    console.log('add formual')
                    await addFormula(formulaName, formulaExpression, selectedYear, code);
                    setIsEditFormula(false)
                    setEditingFormula(null)
                    setIsDeleteFormula(false)

                } catch (error) {
                    console.log(error)
                }

                setReload(true)
                closeDialog(formulaDialogRef)
                console.log('formula add')
            }

        } catch (error) {
            console.log(error)
        }
    }

    const insertIntoExpression = (shortName) => {
        setFormulaExpression(formulaExpression + shortName);
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
                        <select id="schoolYear" value={selectedYear} onChange={schoolYearChange}>
                            {Array.from(schoolYears).map(year => (
                                <option key={year} value={year}>{year} / {year + 1}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <section>
                    <div className="section-header">
                        <h2>Aktivnosti</h2>
                        <button id="addActivityBtn" className="add-activity-button" onClick={() => openActivityDialog()}>Nova aktivnost</button>
                    </div>
                    <div id="activitiesContainer">
                        {activities.filter(activity => activity.schoolYear == selectedYear).length > 0 ? (
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
                                        <tr key={activity.id}>
                                            <td>{activity.shortName}</td>
                                            <td>{activity.name}</td>
                                            <td>{activity.maxPoints}</td>
                                            <td className="action-column">
                                                <span className="material-icons" onClick={() => handleActivityClick(activity)}>edit</span>
                                                <span className="material-icons" onClick={() => handleActivityClick(activity, false)}>delete</span>
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
                        <button id="addFormulaBtn" className="add-activity-button" onClick={() => openFormulaDialog()}>Nova formula</button>
                    </div>
                    <div id="formulasContainer">
                        {formulas.filter(formula => formula.schoolYear == selectedYear).length > 0 ? (
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
                                        <tr key={formula.id}>
                                            <td>{formula.name}</td>
                                            <td>{formula.expression}</td>
                                            <td className="action-column">
                                                <span className="material-icons" onClick={() => handleFormulaClick(formula)}>edit</span>
                                                <span className="material-icons" onClick={() => handleFormulaClick(formula, false)}>delete</span>
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
                <form method="dialog" id="activityForm" onSubmit={handleSubmitActivity}>
                    <div className="dialog-header">
                        <h3>{activityDialogText}</h3>
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
                <form method="dialog" id="formulaForm" onSubmit={handleSubmitFormula}>
                    <div className="dialog-header">
                        <h3>{formulaDialogText}</h3>
                        <button type="button" id="closeFormulaDialog" className="close-btn" onClick={() => closeDialog(formulaDialogRef)}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                    <label>Naziv</label>
                    <input type="text" name="naziv" value={formulaName} onChange={(e) => setFormulaName(e.target.value)} required />
                    <label>Izraz</label>
                    <textarea name="izraz" value={formulaExpression} onChange={(e) => setFormulaExpression(e.target.value)} required></textarea>
                    <div className="inline-buttons">
                        <span>Aktivnosti</span>
                        <div className="group" id="activityTags">
                            {activities.filter(activity => activity.schoolYear == selectedYear).map((activity, i) => (
                                <button type="button" className='inline-buttons' onClick={() => insertIntoExpression(activity.shortName)}>{activity.shortName}</button>
                            ))}
                        </div>
                    </div>
                    <div className="inline-buttons">
                        <span>Operatori</span>
                        <div className="group" id="operators">
                            <button type="button" onClick={() => insertIntoExpression('+')}>+</button>
                            <button type="button" onClick={() => insertIntoExpression('-')}>-</button>
                            <button type="button" onClick={() => insertIntoExpression('*')}>*</button>
                            <button type="button" onClick={() => insertIntoExpression('<')}>&lt;</button>
                            <button type="button" onClick={() => insertIntoExpression('>')}>&gt;</button>
                            <button type="button" onClick={() => insertIntoExpression('&')}>AND</button>
                            <button type="button" onClick={() => insertIntoExpression('|')}>OR</button>
                            <button type="button" onClick={() => insertIntoExpression(':')}>:</button>
                            <button type="button" onClick={() => insertIntoExpression('?')}>?</button>
                        </div>
                    </div>
                    <div className="buttons">
                        <button type="button" className="cancel-btn" onClick={() => closeDialog(formulaDialogRef)}>Otkaži</button>
                        <button type="submit" className="confirm-btn">Sačuvaj</button>
                    </div>
                </form>
            </dialog>
            <dialog ref={warningDialogRef} id="warningDialog" className="warning-dialog" onCancel={() => closeDialog(warningDialogRef)}>
                <form className="warning-form" onSubmit={
                    isDeleteFormula ? handleSubmitFormula :
                        isDeleteActivity ? handleSubmitActivity :
                            undefined
                }>
                    <div className="dialog-header">
                        <h3>Upozorenje</h3>
                        <button type="button" id="closeWarningDialog" className="close-btn" onClick={() => closeDialog(warningDialogRef)}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                    <div className="warning-content">
                        <span className="material-icons warning-icon">warning</span>
                        <p style={{ whiteSpace: 'pre-line' }}>{warningDialogText}</p>
                    </div>
                    <div className="buttons">
                        <button type="button" className="cancel-btn" id="cancelWarning" onClick={() => closeDialog(warningDialogRef)}>Otkaži</button>
                        <button type="submit" className="confirm-btn" id="confirmDelete">Nastavi</button>
                    </div>
                </form>
            </dialog>
        </div >
    )
}
export default ActivitiesForm
