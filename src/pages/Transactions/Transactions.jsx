import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, fetchCategories, addTransaction, editTransaction, deleteTransaction } from "../../features/transactions/transactionsThunks";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField, MenuItem, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Menu
} from "@mui/material";
import { MdAdd, MdArrowDropUp, MdArrowDropDown, MdFilterList, MdFileDownload, MdDelete, MdEdit } from "react-icons/md";
import { useSnackbar } from "notistack";
import { exportToCSV, exportToJSON } from "../../utils/exportUtils";
import "./Transactions.css";

const Transactions = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { data, status, categories } = useSelector((state) => state.transactions);
  const { currentRole } = useSelector((state) => state.role);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, date: "", description: "", category: "", type: "expense", amount: "" });

  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  const availableMonths = ["All", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const availableYears = ["All", ...Array.from(new Set(data.map(t => t.date.split("-")[0])))].sort();

  const handleOpen = (tx = null) => {
    if (tx) setForm({ ...tx });
    else setForm({ id: null, date: new Date().toISOString().split("T")[0], description: "", category: "General", type: "expense", amount: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    const payload = { ...form, amount: parseFloat(form.amount) };
    if (form.id) {
      dispatch(editTransaction(payload));
      enqueueSnackbar("Transaction successfully updated!", { variant: 'info' });
    } else {
      delete payload.id;
      dispatch(addTransaction(payload));
      enqueueSnackbar("New transaction added!", { variant: 'success' });
    }
    handleClose();
  };

  const handleDeleteClick = (event, id) => {
    setDeleteAnchorEl(event.currentTarget);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    dispatch(deleteTransaction(deleteId));
    enqueueSnackbar("Transaction deleted permanently.", { variant: 'error' });
    setDeleteAnchorEl(null);
  };

  const cancelDelete = () => setDeleteAnchorEl(null);

  const toggleSort = () => setSortOrder(prev => prev === "desc" ? "asc" : "desc");

  const filteredData = useMemo(() => {
    return data.filter(t => {
      const ms = search.trim().toLowerCase();
      const matchesSearch = !ms || t.description.toLowerCase().includes(ms) || t.category.toLowerCase().includes(ms) || t.amount.toString().includes(ms);
      const [y, m] = t.date.split("-");
      const matchesMonth = filterMonth === "All" || m === filterMonth;
      const matchesYear = filterYear === "All" || y === filterYear;
      const matchesType = filterType === "All" || t.type === filterType;
      const matchesCategory = filterCategory === "All" || t.category === filterCategory;
      const matchesMin = minAmount === "" || t.amount >= parseFloat(minAmount);
      const matchesMax = maxAmount === "" || t.amount <= parseFloat(maxAmount);
      return matchesSearch && matchesMonth && matchesYear && matchesType && matchesCategory && matchesMin && matchesMax;
    }).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [data, search, filterMonth, filterYear, sortOrder, filterType, filterCategory, minAmount, maxAmount]);

  const displayData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getMonthName = (m) => {
    if (m === "All") return "All Time";
    const date = new Date(2000, parseInt(m) - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const subTitle = filterMonth === "All" && filterYear === "All" ? "All Time" : `${getMonthName(filterMonth)} ${filterYear !== "All" ? filterYear : ""}`;

  return (
    <div className="transactions-page">
      <div className="card transactions-card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              className="chart-select" style={{ padding: '4px 8px' }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

            <button
              className="chart-select"
              onClick={(e) => setExportAnchorEl(e.currentTarget)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '6px 12px' }}
            >
              <MdFileDownload /> Export
            </button>
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="chart-select">
              <option value="All">Month</option>
              {availableMonths.filter(m => m !== "All").map(m => (<option key={m} value={m}>{getMonthName(m)}</option>))}
            </select>
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="chart-select">
              <option value="All">Year</option>
              {availableYears.filter(y => y !== "All").map(y => (<option key={y} value={y}>{y}</option>))}
            </select>
            <input
              className="chart-select"
              placeholder="Search by name, category..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: '210px' }}
            />

          </div>
        </div>

        {showAdvancedFilters && (
          <div style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: '16px', backgroundColor: 'var(--background)', borderBottom: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="chart-select">
                <option value="All">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="chart-select">
                <option value="All">All Categories</option>
                {categories && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Min Amount</label>
              <input type="number" className="chart-select" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} style={{ width: '100px' }} placeholder="0" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Max Amount</label>
              <input type="number" className="chart-select" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} style={{ width: '100px' }} placeholder="Max" />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => { setFilterType("All"); setFilterCategory("All"); setMinAmount(""); setMaxAmount(""); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, paddingBottom: '8px' }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        <div style={{ padding: '20px 24px 8px 24px' }}>
          <h4 style={{ color: 'var(--primary)', margin: 0, fontWeight: 700 }}>Showing Bills For: {subTitle}</h4>
        </div>

        <TableContainer component={Paper} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: 'var(--primary)', fontWeight: 700, borderBottom: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggleSort}>
                    Date
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '4px' }}>
                      <MdArrowDropUp size={12} style={{ marginBottom: '-6px', color: sortOrder === 'asc' ? 'var(--primary)' : 'var(--text-muted)' }} />
                      <MdArrowDropDown size={12} style={{ color: sortOrder === 'desc' ? 'var(--primary)' : 'var(--text-muted)' }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ color: 'var(--primary)', fontWeight: 700, borderBottom: '1px solid var(--card-border)' }}>Name</TableCell>
                <TableCell style={{ color: 'var(--primary)', fontWeight: 700, borderBottom: '1px solid var(--card-border)' }}>Category</TableCell>
                <TableCell style={{ color: 'var(--primary)', fontWeight: 700, borderBottom: '1px solid var(--card-border)' }}>Type</TableCell>
                <TableCell style={{ color: 'var(--primary)', fontWeight: 700, borderBottom: '1px solid var(--card-border)' }}>Amount Paid</TableCell>
                {currentRole === "Admin" && <TableCell style={{ color: 'var(--primary)', fontWeight: 700, borderBottom: '1px solid var(--card-border)' }}> Edit </TableCell>}
                {currentRole === "Admin" && <TableCell style={{ color: 'var(--primary)', fontWeight: 700, borderBottom: '1px solid var(--card-border)' }}> Delete </TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.map((t) => (
                <TableRow key={t.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--card-border)' }}>{t.date}</TableCell>
                  <TableCell style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--card-border)' }}>{t.description}</TableCell>
                  <TableCell style={{ color: 'var(--primary)', fontWeight: 600, borderBottom: '1px solid var(--card-border)' }}>{t.category}</TableCell>
                  <TableCell style={{ borderBottom: '1px solid var(--card-border)' }}><span className={`type-badge ${t.type}`}>{t.type}</span></TableCell>
                  <TableCell style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--card-border)', fontWeight: 600 }}>₹{t.amount.toLocaleString()}</TableCell>
                  {currentRole === "Admin" && (
                    <TableCell style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => handleOpen(t)}><MdEdit /></span>
                    </TableCell>
                  )}
                  {currentRole === "Admin" && (
                    <TableCell style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <span style={{ color: 'red', cursor: 'pointer', fontWeight: 600 }} onClick={(e) => handleDeleteClick(e, t.id)}><MdDelete /></span>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredData.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '24px' }}>No records found</p>}

        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          style={{ color: 'var(--text-main)', borderTop: '1px solid var(--card-border)' }}
        />
      </div>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: 'var(--card-color)', color: 'var(--text-main)', minWidth: '400px', zIndex: 10000 } }}>
        <DialogTitle>{form.id ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
          <TextField type="date" label="Date" InputLabelProps={{ shrink: true }} size="small" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <TextField label="Description" size="small" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <TextField select label="Category" size="small" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {categories && categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Type" size="small" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
          <TextField type="number" label="Amount" size="small" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          <Button onClick={handleClose} style={{ color: 'var(--text-muted)' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>Save</Button>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={deleteAnchorEl} open={Boolean(deleteAnchorEl)} onClose={cancelDelete}
        PaperProps={{ style: { backgroundColor: 'var(--card-color)', color: 'var(--text-main)', padding: '4px' } }}>
        <MenuItem onClick={confirmDelete} style={{ color: 'red', fontWeight: 600 }}>Confirm Delete</MenuItem>
        <MenuItem onClick={cancelDelete}>Cancel</MenuItem>
      </Menu>

      <Menu anchorEl={exportAnchorEl} open={Boolean(exportAnchorEl)} onClose={() => setExportAnchorEl(null)}
        PaperProps={{ style: { backgroundColor: 'var(--card-color)', color: 'var(--text-main)', padding: '4px' } }}>
        <MenuItem
          onClick={() => { exportToCSV(filteredData); setExportAnchorEl(null); }}
          style={{ display: 'flex', gap: '8px' }}
        >
          Export as CSV
        </MenuItem>
        <MenuItem
          onClick={() => { exportToJSON(filteredData); setExportAnchorEl(null); }}
          style={{ display: 'flex', gap: '8px' }}
        >
          Export as JSON
        </MenuItem>
      </Menu>

    </div>
  );
};


export default Transactions;
