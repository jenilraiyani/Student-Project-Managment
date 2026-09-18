import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [reportType, setReportType] = useState('Project Progress');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const isCompletedTask = (t) => (t.taskStatusName || '').toLowerCase().includes('complete');

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('spms_token')}` };

      const [allocRes, taskRes] = await Promise.all([
        fetch('https://localhost:7089/api/ProjectAllocation', { headers }),
        fetch('https://localhost:7089/api/Task', { headers })
      ]);

      let allocs = [];
      let tasks = [];

      if (allocRes.ok) {
        const json = await allocRes.json();
        allocs = json.data || json.Data || [];
      }
      if (taskRes.ok) {
        const json = await taskRes.json();
        tasks = json.data || json.Data || [];
      }

      const mappedData = allocs.map(alloc => {
        // Live task stats from Task API for this allocation
        const allocTasks = tasks.filter(t => t.projectAllocationID === alloc.projectAllocationID);
        const totalTasks = allocTasks.length;
        const tasksCompleted = allocTasks.filter(isCompletedTask).length;

        // Overall progress: prefer average of task progress; fallback to completed ratio / allocation field
        let progress = 0;
        if (totalTasks > 0) {
          const avgTaskProgress = Math.round(
            allocTasks.reduce((sum, t) => sum + (Number(t.progressPercentage) || 0), 0) / totalTasks
          );
          progress = avgTaskProgress > 0
            ? avgTaskProgress
            : Math.round((tasksCompleted / totalTasks) * 100);
        } else {
          progress = Number(alloc.progressPercentage) || 0;
        }

        let st = 'Pending';
        if (totalTasks > 0 && tasksCompleted === totalTasks) st = 'Completed';
        else if (progress > 0 || tasksCompleted > 0) st = 'In Progress';

        return {
          id: alloc.projectAllocationID,
          projectName: alloc.projectTitle || 'Unknown Project',
          faculty: alloc.facultyName || '-',
          students: alloc.studentName || '-',
          tasksCompleted,
          totalTasks,
          progress,
          status: st,
          assignedDate: alloc.assignedDate,
          projectStartDate: alloc.projectStartDate,
          projectEndDate: alloc.projectEndDate
        };
      });

      setReportData(mappedData);
    } catch (err) {
      console.error('Error fetching report data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = reportData.filter(row => {
    if (!startDate && !endDate) return true;
    const refDate = row.assignedDate || row.projectStartDate;
    if (!refDate) return true;
    const d = new Date(refDate);
    if (isNaN(d.getTime())) return true;
    if (startDate && d < new Date(`${startDate}T00:00:00`)) return false;
    if (endDate && d > new Date(`${endDate}T23:59:59`)) return false;
    return true;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-inprogress';
      case 'Pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return '#20C997';
    if (progress >= 50) return '#6B5CA5';
    if (progress > 0) return '#F59E0B';
    return '#CBD5E1';
  };

  return (
    <>
      <div className="container-fluid p-0">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>System Reports</h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
                <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-muted">Home</a></li>
                <li className="breadcrumb-item active fw-semibold" aria-current="page">Reports</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card spms-premium-card border-0 mb-4">
          <div className="card-body p-4">
            <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Report Configuration</h6>

            <div className="row align-items-end g-3">
              <div className="col-12 col-md-4">
                <label className="form-label small fw-bold text-secondary">Report Category</label>
                <select
                  className="form-select spms-input shadow-none"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="Project Progress">Project Progress</option>
                  <option value="Task Completion">Task Completion Summary</option>
                  <option value="Student Performance">Student Performance Metrics</option>
                  <option value="Faculty Supervision">Faculty Supervision Details</option>
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold text-secondary">Start Date</label>
                <input
                  type="date"
                  className="form-control spms-input shadow-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold text-secondary">End Date</label>
                <input
                  type="date"
                  className="form-control spms-input shadow-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-2 d-flex justify-content-end">
                <button
                  className="btn spms-btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
                  onClick={fetchReportData}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card spms-premium-card border-0">
          <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold text-dark mb-0">Generated Results: {reportType}</h6>

            <div className="d-flex gap-2">
              <button className="btn btn-sm spms-btn-export-excel d-flex align-items-center gap-2 shadow-sm" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z" />
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                </svg>
                Export Excel
              </button>
              <button className="btn btn-sm spms-btn-export-pdf d-flex align-items-center gap-2 shadow-sm" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.249 0 .45.05.603.151.155.101.267.246.336.434.068.188.103.411.103.667 0 .256-.035.48-.103.67-.069.19-.181.335-.336.436-.153.1-.354.15-.603.15h-.563v-2.508Zm3.89 2.508V12.49h1.25v-.64h-1.25v-.645h1.36v-.64h-2.15v3.999h2.15v-.64h-1.36Z" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>

          <div className="card-body p-4">
            {loading ? (
              <div className="text-center py-5 text-muted">Loading report...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle spms-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '25%' }}>Project Name</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '18%' }}>Supervising Faculty</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '20%' }}>Assigned Students</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '12%' }}>Tasks Status</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase" style={{ width: '15%' }}>Overall Progress</th>
                      <th scope="col" className="text-muted fw-bold text-uppercase text-center" style={{ width: '10%' }}>Project Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((row) => (
                        <tr key={row.id} className="spms-table-row">
                          <td>
                            <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{row.projectName}</span>
                          </td>
                          <td>
                            <span className="text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>{row.faculty}</span>
                          </td>
                          <td>
                            <span className="text-secondary fw-medium small">{row.students}</span>
                          </td>
                          <td>
                            <div className="text-dark fw-bold small">
                              {row.tasksCompleted} / {row.totalTasks}{' '}
                              <span className="text-muted fw-medium">Completed</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '8px', borderRadius: '4px', backgroundColor: '#E2E8F0', minWidth: '70px' }}>
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: `${Math.min(100, Math.max(0, row.progress))}%`,
                                    backgroundColor: getProgressColor(row.progress)
                                  }}
                                  aria-valuenow={row.progress}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="fw-bold text-dark small" style={{ minWidth: '40px' }}>
                                {row.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className={`spms-report-badge ${getStatusClass(row.status)}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <h6 className="fw-semibold text-dark">No report data found</h6>
                          <p className="mb-0 small">Add project allocations and tasks to see overall progress.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>
        {`
          .spms-premium-card {
            border-radius: 12px;
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-top: 4px solid #6B5CA5 !important;
          }
          .spms-input {
            border-radius: 8px;
            border: 1px solid #E2E8F0;
            background-color: #F8FAFC;
            font-size: 0.95rem;
            padding: 10px 15px;
            color: #1E293B;
          }
          .spms-input:focus {
            background-color: #FFFFFF;
            border-color: #6B5CA5;
            box-shadow: 0 0 0 3px rgba(107, 92, 165, 0.1) !important;
          }
          .spms-btn-primary {
            background-color: #6B5CA5;
            color: #FFFFFF;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
          }
          .spms-btn-primary:hover {
            background-color: #55488c;
            color: #FFFFFF;
          }
          .spms-btn-export-excel {
            background-color: #f0fdf4;
            color: #16a34a;
            border: 1px solid #bbf7d0;
            font-weight: 600;
            border-radius: 6px;
          }
          .spms-btn-export-pdf {
            background-color: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
            font-weight: 600;
            border-radius: 6px;
          }
          .spms-table th {
            font-size: 0.75rem;
            letter-spacing: 0.8px;
            border-bottom: 2px solid #F1F5F9;
            padding-bottom: 15px;
            color: #64748B !important;
          }
          .spms-table td {
            padding: 16px 10px;
            border-bottom: 1px solid #F1F5F9;
            vertical-align: middle;
          }
          .spms-table-row:hover { background-color: #F8FAFC !important; }
          .spms-report-badge {
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            border: 1px solid transparent;
            display: inline-block;
          }
          .spms-report-badge.status-completed { background-color: rgba(32, 201, 151, 0.1); color: #17a57a; border-color: rgba(32, 201, 151, 0.2); }
          .spms-report-badge.status-inprogress { background-color: rgba(107, 92, 165, 0.1); color: #6B5CA5; border-color: rgba(107, 92, 165, 0.2); }
          .spms-report-badge.status-pending { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; border-color: rgba(245, 158, 11, 0.2); }
        `}
      </style>
    </>
  );
};

export default Reports;
