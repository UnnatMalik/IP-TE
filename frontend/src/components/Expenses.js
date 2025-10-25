import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    group: '',
  });

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    group: '',
    splitType: 'personal',
    splits: [],
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, categoriesRes, groupsRes] = await Promise.all([
        api.get('/expenses', { params: filters }),
        api.get('/categories'),
        api.get('/groups'),
      ]);

      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
      setGroups(groupsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGroupChange = async (e) => {
    const groupId = e.target.value;
    setFormData({ ...formData, group: groupId });

    if (groupId) {
      try {
        const res = await api.get(`/groups/${groupId}`);
        setGroupMembers(res.data.members.map((m) => m.user));
      } catch (error) {
        console.error('Error fetching group members:', error);
      }
    } else {
      setGroupMembers([]);
    }
  };

  const handleSplitTypeChange = (e) => {
    const splitType = e.target.value;
    setFormData({ ...formData, splitType, splits: [] });

    if (splitType === 'equal' && groupMembers.length > 0) {
      const splitAmount = formData.amount / groupMembers.length;
      const splits = groupMembers.map((member) => ({
        user: member._id,
        amount: splitAmount,
      }));
      setFormData({ ...formData, splitType, splits });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let splits = [];

      if (formData.splitType === 'personal') {
        // Personal expense
        splits = [];
      } else if (formData.splitType === 'equal' && groupMembers.length > 0) {
        // Equal split
        splits = groupMembers.map((member) => member._id);
      }

      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        splits: formData.splitType === 'equal' ? splits : formData.splits,
      };

      await api.post('/expenses', expenseData);
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Failed to create expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      }
    }
  };

  const handleSettle = async (id) => {
    try {
      await api.put(`/expenses/${id}/settle`);
      fetchData();
    } catch (error) {
      console.error('Error settling expense:', error);
      alert('Failed to settle expense');
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      group: '',
      splitType: 'personal',
      splits: [],
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setGroupMembers([]);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="expenses-header">
        <h1>Expenses</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Expense
        </button>
      </div>

      <div className="card filters-card">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              className="form-control"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Group</label>
            <select
              name="group"
              className="form-control"
              value={filters.group}
              onChange={handleFilterChange}
            >
              <option value="">All Groups</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-control"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-control"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>All Expenses ({expenses.length})</h2>
        {expenses.length > 0 ? (
          <div className="expense-list">
            {expenses.map((expense) => (
              <div key={expense._id} className="expense-item-detailed">
                <div className="expense-main">
                  <div className="expense-icon" style={{ background: expense.category.color }}>
                    {expense.category.icon}
                  </div>
                  <div className="expense-info">
                    <h4>{expense.description}</h4>
                    <p className="expense-meta">
                      {expense.category.name} • {new Date(expense.date).toLocaleDateString()}
                      {expense.group && ` • ${expense.group.name}`}
                    </p>
                    <p className="expense-paid">Paid by: {expense.paidBy.name}</p>
                    {expense.notes && <p className="expense-notes">📝 {expense.notes}</p>}
                  </div>
                  <div className="expense-actions">
                    <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
                    {expense.splitType !== 'personal' && (
                      <span className="split-badge">{expense.splitType} split</span>
                    )}
                  </div>
                </div>

                {expense.splits && expense.splits.length > 0 && (
                  <div className="expense-splits">
                    <h5>Split Details:</h5>
                    {expense.splits.map((split, index) => (
                      <div key={index} className="split-item">
                        <span>{split.user.name}</span>
                        <span>₹{split.amount.toFixed(2)}</span>
                        <span className={split.paid ? 'paid-status' : 'unpaid-status'}>
                          {split.paid ? '✅ Paid' : '⏳ Pending'}
                        </span>
                        {!split.paid && split.user._id !== expense.paidBy._id && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSettle(expense._id)}
                          >
                            Settle Up
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="expense-buttons">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(expense._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No expenses found</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Description *</label>
                <input
                  type="text"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  className="form-control"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Group (Optional)</label>
                <select
                  name="group"
                  className="form-control"
                  value={formData.group}
                  onChange={handleGroupChange}
                >
                  <option value="">Personal Expense</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.group && (
                <div className="form-group">
                  <label>Split Type</label>
                  <select
                    name="splitType"
                    className="form-control"
                    value={formData.splitType}
                    onChange={handleSplitTypeChange}
                  >
                    <option value="personal">Personal (I'll pay)</option>
                    <option value="equal">Split Equally</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
