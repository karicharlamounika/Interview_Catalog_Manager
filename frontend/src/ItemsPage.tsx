import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Item {
  id: number;
  name: string;
  quantity: number;
}

const ItemsPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // For add item modal/form visibility
  const [showAddForm, setShowAddForm] = useState(false);

  // Add item inputs
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState<number>(1);

  // Editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState<number>(1);

  const token = localStorage.getItem("token");

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
      setLoading(false);
    } catch (error) {
      alert("Failed to fetch items, please login again.");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Add new item
  const handleAddItem = async () => {
    if (!newName.trim()) {
      alert("Item name cannot be empty");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/items",
        { name: newName, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) => [...prev, res.data]);
      setNewName("");
      setNewQuantity(1);
      setShowAddForm(false);
    } catch (error) {
      alert("Failed to add item");
    }
  };

  // Delete item
  const handleDeleteItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Failed to delete item");
    }
  };

  // Start editing item
  const startEditing = (item: Item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Save edited item
  const saveEditing = async () => {
    if (!editName.trim()) {
      alert("Item name cannot be empty");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:5000/items/${editingId}`,
        { name: editName, quantity: editQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId ? res.data : item
        )
      );
      setEditingId(null);
    } catch (error) {
      alert("Failed to update item");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f6f7",
      }}
    >
      <h2 style={{ color: "#6c5ce7", marginBottom: "1rem" }}>Catalog</h2>

      {/* Add  Item button */}
      <button
        onClick={() => setShowAddForm((v) => !v)}
        test-id="addNewItem"
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#55efc4",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        {showAddForm ? "Cancel" : "Add New Item"}
      </button>

      {/* Add Item Form */}
      {showAddForm && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            backgroundColor: "#d0f0fd",
            borderRadius: "10px",
            maxWidth: "400px",
          }}
        >
          <input
            type="text"
            placeholder="Item Name"
            test-id="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: "0.5rem", width: "60%", marginRight: "0.5rem" }}
          />
          <input
            type="number"
            test-id="quantity"
            min={1}
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            style={{ padding: "0.5rem", width: "25%", marginRight: "0.5rem" }}
          />
          <button
            onClick={handleAddItem}
            test-id="add"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0984e3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Add
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <table
          test-id = "itemsTable"
          style={{
            width: "100%",
            maxWidth: "600px",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#9589eeff", color: "white" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Quantity</th>
              <th style={{ padding: "12px", textAlign: "center", width: "120px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td test-id = 'itemName' style={{ padding: "10px" }}>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      test-id="editName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ padding: "0.3rem", width: "90%" }}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td test-id = 'itemQuantity' style={{ padding: "10px" }}>
                  {editingId === item.id ? (
                    <input
                      type="number"
                      test-id="editQuantity"
                      min={1}
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(Number(e.target.value))}
                      style={{ padding: "0.3rem", width: "50px" }}
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td
                  test-id = "editActions" 
                  style={{
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {editingId === item.id ? (
                    <>
                      <button
                        test-id="editSave"
                        onClick={saveEditing}
                        style={{
                          marginRight: "0.5rem",
                          backgroundColor: "#00b894",
                          border: "none",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        title="Save"
                      >
                        💾
                      </button>
                      <button
                        onClick={cancelEditing}
                        test-id="cancelEdit"
                        style={{
                          backgroundColor: "#d63031",
                          border: "none",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        title="Cancel"
                      >
                        ❌
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        test-id="editItem"
                        onClick={() => startEditing(item)}
                        style={{
                          marginRight: "0.5rem",
                          backgroundColor: "#fdcb6e",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        test-id="deleteItem"
                        onClick={() => handleDeleteItem(item.id)}
                        style={{
                          backgroundColor: "#7c6161ff",
                          border: "none",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
          <div style={{ marginTop: "auto" }} />

    {/* Logout Button at the Bottom */}
    <button
      test-id = 'logoutBtn'
      onClick={handleLogout}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#a29bfe",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        alignSelf: "center", // center horizontally
        marginTop: "2rem",
      }}
    >
      Logout
    </button>
    </div>
  );
};

export default ItemsPage;