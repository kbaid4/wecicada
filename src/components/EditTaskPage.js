import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logTaskChange } from '../utils/auditLogger';
import { supabase } from '../supabaseClient';

const EditTaskPage = () => {
  const { eventId, taskIndex } = useParams();
  const numericTaskIndex = parseInt(taskIndex, 10); // Ensure taskIndex is a number
  const navigate = useNavigate();

  // Get user info from localStorage
  const storedName = localStorage.getItem('signupName');
  const displayName = storedName ? storedName : 'User';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const [activeNav, setActiveNav] = useState('Events');

  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Messages', path: '/MessagesPage' }
  ];
  const userNavItems = [
    { name: 'My Work', path: '/my-work' },
    { name: 'My Team', path: '/my-team' }
  ];

  const [taskData, setTaskData] = useState({
    name: '',
    budget: '',
    status: '',
    date: '',
    description: '',
    searchedSupplier: ''
  });
  const statusOptions = ['Stopped', 'In Progress', 'Negotiation', 'Completed'];
  const [supplierOptions, setSupplierOptions] = useState([]);
  // TODO: Replace with real data if needed
  const mySuppliers = [];

  useEffect(() => {
    // Load suppliers from localStorage (signedUpSuppliers)
    const localSuppliers = JSON.parse(localStorage.getItem('signedUpSuppliers') || '[]');
    setSupplierOptions(localSuppliers);
  }, []);

  useEffect(() => {
    async function fetchSuppliers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, company_name, created_at, user_type')
        .eq('user_type', 'supplier')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        setSupplierOptions(data);
      } else {
        setSupplierOptions([]);
      }
    }
    fetchSuppliers();
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
    const taskArr = allTasksObj[eventId] || [];
    if (taskArr[taskIndex]) {
      setTaskData(taskArr[taskIndex]);
    }
  }, [eventId, taskIndex]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Get the current task data before updating
      const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
      const tasksArr = allTasksObj[eventId] || [];
      const oldTask = tasksArr[numericTaskIndex];
      
      // Update the task
      const updatedTask = { ...taskData };
      tasksArr[numericTaskIndex] = updatedTask;
      allTasksObj[eventId] = tasksArr;
      localStorage.setItem('tasks', JSON.stringify(allTasksObj));

      // Update event's tasks array if needed
      const eventsArr = JSON.parse(localStorage.getItem('events')) || [];
      const eventIdx = eventsArr.findIndex(ev => ev.id === eventId);
      if (eventIdx !== -1) {
        eventsArr[eventIdx].tasks = tasksArr;
        localStorage.setItem('events', JSON.stringify(eventsArr));
      }

      // Log the task update
      if (userId) {
        try {
          // Ensure task has a valid ID for logging
          const taskWithId = {
            ...updatedTask,
            id: updatedTask.id || `task-${eventId}-${taskIndex}`
          };
          await logTaskChange('update', taskWithId, userId);
        } catch (logError) {
          console.error('Error logging task update:', logError);
        }
      }

      navigate(`/EventsManagementPage/${eventId}`);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="app-container">
      <style jsx>{`
        :root {
          --primary-purple: #441752;
          --secondary-purple: #A888B5;
          --background-light: #A888B5;
          --background-dark: #441752;
          --input-bg: #fff;
          --input-border: #A888B5;
          --card-bg: #441752;
          --divider: #A888B5;
          --text-dark: #1A1F36;
          --text-light: #fff;
          --btn-primary: #A888B5;
          --btn-primary-text: #441752;
          --btn-secondary: #d1b3e0;
          --btn-secondary-text: #441752;
          --btn-danger: #e57373;
        }
        .app-container {
          min-height: 100vh;
          background: var(--background-light);
          font-family: 'Inter', sans-serif;
        }
        .edit-header {
          padding: 32px 0 12px 0;
          font-family: 'Inter', sans-serif;
          margin-left: 330px;
        }
        .edit-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-purple);
          margin-bottom: 0;
        }
        .form-container {
          background: var(--card-bg);
          border-radius: 10px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          max-width: 700px;
          margin: 0 auto;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px 40px;
          margin-bottom: 24px;
        }

        /* Responsive Styles */
        @media (max-width: 900px) {
          .edit-header {
            margin-left: 0;
            padding: 24px 0 8px 0;
          }
          .form-container {
            padding: 18px;
            max-width: 100%;
          }
          .form-grid {
            gap: 18px 10px;
          }
        }
        @media (max-width: 600px) {
          .edit-header {
            padding: 12px 0 4px 0;
          }
          .edit-title {
            font-size: 1.2rem;
          }
          .form-container {
            padding: 8px;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 12px;
          }
          .form-column {
            gap: 10px;
          }
          .date-group, .form-actions {
            flex-direction: column;
            gap: 10px;
            padding-top: 10px;
          }
          .primary-btn {
            padding: 8px 14px;
            font-size: 12px;
          }
          label {
            font-size: 13px;
          }
          input, select {
            font-size: 13px;
            padding: 8px 6px;
          }
        }
        .form-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        label {
          font-size: 15px;
          color: var(--secondary-purple);
          font-weight: 500;
        }
        input,
        select {
          padding: 12px 10px;
          border: 1px solid var(--input-border);
          border-radius: 6px;
          font-size: 15px;
          background: var(--input-bg);
          color: var(--primary-purple);
          width: 100%;
        }
        .date-group {
          display: flex;
          flex-direction: row;
          gap: 24px;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          border-top: 1px solid var(--divider);
          padding-top: 24px;
        }
        .primary-btn {
          padding: 12px 32px;
          background: var(--btn-primary);
          color: var(--btn-primary-text);
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .primary-btn:disabled {
          background: var(--btn-secondary);
          color: var(--btn-secondary-text);
          cursor: not-allowed;
        }
        .primary-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(44, 125, 250, 0.2);
        }
        .danger-btn {
          background: var(--btn-danger) !important;
          color: #fff !important;
        }
      `}</style>
      <main className="content-area edit-event-root">
        <div className="edit-header">
          <div className="edit-title">Edit Task</div>
        </div>
        <div className="form-container">
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="form-grid">
              <div className="form-column">
                <div className="input-group">
                  <label>Task Name</label>
                  <input type="text" name="name" value={taskData.name} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Budget</label>
                  <input type="number" name="budget" value={taskData.budget} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Search Suppliers</label>
                  <select
  value={taskData.searchedSupplier}
  onChange={e => setTaskData({ ...taskData, searchedSupplier: e.target.value })}
>
  <option value="">Select Supplier</option>
  {mySuppliers && mySuppliers.length > 0 && (
    <optgroup label="My Suppliers">
      {mySuppliers.map(supplier => {
        const displayName = supplier.full_name || supplier.company_name || supplier.email || `Supplier ${supplier.id}`;
        return (
          <option key={supplier.id} value={supplier.id}>{displayName}</option>
        );
      })}
    </optgroup>
  )}
  {(() => {
    const localSuppliers = JSON.parse(localStorage.getItem('signedUpSuppliers') || '[]');
    return localSuppliers.length > 0 ? (
      <optgroup label="Signed Up Suppliers">
        {localSuppliers.map(supplier => {
          const displayName = supplier.name || supplier.email || `Supplier ${supplier.id}`;
          const serviceType = supplier.serviceType;
          return (
            <option key={supplier.id} value={supplier.id}>
              {serviceType ? `${displayName} (${serviceType})` : `${displayName} (No Service Type)`}
            </option>
          );
        })}
      </optgroup>
    ) : null;
  })()}
</select>
                </div>
                <div className="input-group">
                <select name="status" value={taskData.status} onChange={handleInputChange}>
                    <option value="">Select Status</option>
                    {statusOptions.map((status, idx) => (
                      <option key={idx} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Date</label>
                  <input type="date" name="date" value={taskData.date} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <input type="text" name="description" value={taskData.description} onChange={handleInputChange} />
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn">Save</button>
              <button type="button" className="primary-btn danger-btn" onClick={() => navigate(`/EventsManagementPage/${eventId}`)}>Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditTaskPage;
