import HeaderComponent from "../components/HeaderComponent"
import { useLocation } from 'react-router-dom';
import { getSubjectActivities } from "../services/SubjectManagementService";
import { useState } from "react";
import { useEffect } from "react";
import ActivitiesForm from "../components/ActivitiesForm";

const ActivitiesPage = () => {
    // const [activities, setActivities] = useState([]);
    //
    // const location = useLocation();
    // const subject = location.state?.subject;
    //
    // const code = subject.match(/\((\d+)\)/)[1];
    // useEffect(async () => {
    //     const act = await getSubjectActivities(code);
    //     setActivities(act.activities);
    // }, []);
    //
    // console.log(activities);
    // return (
    //     <div>
    //         <HeaderComponent />
    //     </div>
    // )
    return (
        <ActivitiesForm />
    )
}

export default ActivitiesPage
