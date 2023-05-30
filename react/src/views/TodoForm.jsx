import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

const TodoForm = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [todo, setTodo] = useState({
    id: null,
    name: "",
    status: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/todos/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setTodo(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (todo.id) {
      axiosClient
        .put(`/todos/${todo.id}`, todo)
        .then(() => {
          setNotification("Todo updated successfully...");
          navigate("/todos");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/todos", todo)
        .then(() => {
          setNotification("Todo created successfully...");
          navigate("/todos");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {todo.id && <h2>Update todo</h2>}
      {!todo.id && <h2>New todo</h2>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={todo.name}
              onChange={(ev) => setTodo({ ...todo, name: ev.target.value })}
              placeholder="Name"
            />
            <input
              value={todo.status}
              onChange={(ev) => setTodo({ ...todo, status: ev.target.value })}
              placeholder="Status(use 1 or 0)"
            />
            <button className="btn">Save</button>
            &nbsp;
            <Link to="/todos">
              <button className="btn">Cancel</button>
            </Link>
          </form>
        )}
      </div>
    </>
  );
};

export default TodoForm;
