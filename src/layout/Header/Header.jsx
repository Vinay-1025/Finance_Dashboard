import React from "react";
import "./Header.css";
import Avatar from "@mui/material/Avatar";
import useTheme from "../../hooks/useTheme";
import { MdOutlineDarkMode, MdOutlineLightMode, MdAdd } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../../features/role/roleSlice";
import { addTransaction, fetchCategories } from "../../features/transactions/transactionsThunks";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
import { useSnackbar } from "notistack";

const Header = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { currentRole } = useSelector((state) => state.role);
  const categories = useSelector((state) => state.transactions.categories);
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ date: new Date().toISOString().split("T")[0], description: "", category: "General", type: "expense", amount: "" });

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleRoleChange = (e) => {
    dispatch(setRole(e.target.value));
  };

  const handleOpen = () => {
    setForm({ date: new Date().toISOString().split("T")[0], description: "", category: "General", type: "expense", amount: "" });
    setOpen(true);
  };

  const handleSave = () => {
    const payload = { ...form, amount: parseFloat(form.amount) };
    dispatch(addTransaction(payload));
    enqueueSnackbar("Global transaction added!", { variant: 'success' });
    setOpen(false);
  };

  return (
    <div className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FiMenu />
        </button>

        <h3 className="header-title">Finance Dashboard</h3>
      </div>
      <div className="header-right">
        {currentRole === "Admin" && (
          <Button variant="contained" startIcon={<MdAdd />} onClick={handleOpen}
            className="add-tx-btn"
            style={{ backgroundColor: 'var(--primary)', color: '#fff', textTransform: 'none', fontWeight: 600, fontSize: '12px' }}>
            <span className="btn-text">Add Transaction</span>
          </Button>
        )}

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle theme">
          {theme === "light" ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
        </button>

        <select className="role-select" value={currentRole} onChange={handleRoleChange}>
          <option value="Viewer">Viewer</option>
          <option value="Admin">Admin</option>
        </select>

        <Avatar className="avatar" alt="User Avatar" src="https://i.pravatar.cc/150?img=68" />
      </div>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        fullWidth
        maxWidth="xs"
        PaperProps={{ 
          style: { 
            backgroundColor: 'var(--card-color)', 
            color: 'var(--text-main)',
            margin: '16px',
            width: 'calc(100% - 32px)',
            maxWidth: '450px'
          } 
        }}
      >
        <DialogTitle>New Global Transaction</DialogTitle>
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
          <Button onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Header;