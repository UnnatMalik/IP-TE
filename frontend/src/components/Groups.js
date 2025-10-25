import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Groups.css';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [],
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups');
      setGroups(res.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (email) => {
    if (!email) {
      setUsers([]);
      return;
    }

    try {
      const res = await api.get('/users', { params: { search: email } });
      setUsers(res.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchEmail(value);
    searchUsers(value);
  };

  const addMember = (userId) => {
    if (!formData.members.includes(userId)) {
      setFormData({ ...formData, members: [...formData.members, userId] });
    }
    setSearchEmail('');
    setUsers([]);
  };

  const removeMember = (userId) => {
    setFormData({
      ...formData,
      members: formData.members.filter((id) => id !== userId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/groups', formData);
      setShowModal(false);
      resetForm();
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await api.delete(`/groups/${id}`);
        fetchGroups();
      } catch (error) {
        console.error('Error deleting group:', error);
        alert('Failed to delete group');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      members: [],
    });
    setSearchEmail('');
    setUsers([]);
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
      <div className="groups-header">
        <h1>Groups</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create Group
        </button>
      </div>

      <div className="groups-grid">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group._id} className="group-card">
              <div className="group-header">
                <div className="group-image">{group.name.charAt(0).toUpperCase()}</div>
                <div className="group-info">
                  <h3>{group.name}</h3>
                  {group.description && <p>{group.description}</p>}
                </div>
              </div>

              <div className="group-members">
                <h4>Members ({group.members.length})</h4>
                <div className="members-list">
                  {group.members.slice(0, 3).map((member) => (
                    <div key={member.user._id} className="member-item">
                      <div className="member-avatar">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{member.user.name}</span>
                    </div>
                  ))}
                  {group.members.length > 3 && (
                    <div className="member-item">
                      <div className="member-avatar">+{group.members.length - 3}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="group-actions">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(group._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-groups">
            <h3>No groups yet</h3>
            <p>Create a group to start splitting expenses with friends</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Group</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Group Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Add Members</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by email or name"
                  value={searchEmail}
                  onChange={handleSearchChange}
                />

                {users.length > 0 && (
                  <div className="user-search-results">
                    {users.map((user) => (
                      <div key={user._id} className="user-search-item">
                        <div className="user-info">
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => addMember(user._id)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.members.length > 0 && (
                  <div className="selected-members">
                    <h4>Selected Members:</h4>
                    {formData.members.map((memberId) => {
                      const user = users.find((u) => u._id === memberId);
                      return user ? (
                        <div key={memberId} className="selected-member">
                          <span>{user.name}</span>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeMember(memberId)}
                          >
                            Remove
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
