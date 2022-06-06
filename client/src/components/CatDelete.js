import { useLocation, useNavigate } from "react-router-dom";

const CatDelete = ({deleteHandler}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const cat = location.state.cat;
    const backHandler = (e) => {
        e.preventDefault();
        navigate('/cats');
    }
    const confirmHandler = (e) => {
        e.preventDefault();
        deleteHandler(cat);
        navigate('/cats');
    }
    return (
        <><div>Are you sure to delete?</div><form onSubmit={confirmHandler}>
            <button>Yes</button>
        </form><form onSubmit={backHandler}>
                <button>No</button>
            </form></>
    );
}

export default CatDelete;