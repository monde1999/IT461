import { useLocation, useNavigate } from "react-router-dom";

const DogDelete = ({deleteHandler}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dog = location.state.dog;
    const backHandler = (e) => {
        e.preventDefault();
        navigate('/dogs');
    }
    const confirmHandler = (e) => {
        e.preventDefault();
        deleteHandler(dog);
        navigate('/dogs');
    }
    return (
        <><div>Are you sure to delete?</div><form onSubmit={confirmHandler}>
            <button>Yes</button>
        </form><form onSubmit={backHandler}>
                <button>No</button>
            </form></>
    );
}

export default DogDelete;