import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getTodos();
  }, []);

  const onDeleteClick = (todo) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) {
      return;
    }
    axiosClient.delete(`/todos/${todo.id}`).then(() => {
      setNotification("Todo deleted successfully...");
      getTodos();
    });
  };

  const getTodos = () => {
    setLoading(true);
    axiosClient
      .get("/todos")
      .then(({ data }) => {
        setLoading(false);
        setTodos(data.data);
        console.log(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Todos</h2>
        <Link className="btn-add" to="/todos/new">
          New Todo
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>Todo name</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {todos.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.created_at}</td>
                  <td>
                    {item.status ? (
                      <span className="badge-success">completed</span>
                    ) : (
                      <span className="badge-secondary">pending</span>
                    )}
                  </td>
                  <td>
                    <Link className="btn-edit" to={"/todos/" + item.id}>
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      className="btn-delete"
                      onClick={(ev) => onDeleteClick(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Todos;
