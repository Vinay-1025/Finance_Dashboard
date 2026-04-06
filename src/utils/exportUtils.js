/**
 * Utility to export transactions as CSV and JSON.
 */

export const exportToCSV = (data, filename = "transactions.csv") => {
  if (!data || !data.length) return;

  const headers = ["ID", "Type", "Amount", "Category", "Date", "Description"];
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      [
        row.id,
        row.type,
        row.amount,
        `"${row.category}"`,
        row.date,
        `"${row.description.replace(/"/g, '""')}"`,
      ].join(",")
    ),
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = "transactions.json") => {
  if (!data || !data.length) return;

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
