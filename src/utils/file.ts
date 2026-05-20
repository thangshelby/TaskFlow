
export const convertBase64ToFile = (base64: string, filename = "upload.png") => {
  const base64Type = base64.split(",")[0].split(":")[1].split(";")[0];
  const base64Data = base64.split(",")[1];
  const binaryString = window.atob(base64Data);

  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new File([bytes], filename, { type: base64Type });
};

// Hàm export CSV
export const exportCSV = (issues: any[], filename = "issues.csv") => {
  if (!issues || issues.length === 0) {
    return;
  }

  const headers = Object.keys(issues[0]);
  const csvRows = [
    headers.join(","), // header row
    ...issues.map((row) =>
      headers.map((field) => JSON.stringify(row[field] ?? "")).join(","),
    ),
  ];
  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();
};

// Hàm export Excel đơn giản (dùng tab-separated values)
export const exportExcel = (issues: any[], filename = "issues.xls") => {
  if (!issues || issues.length === 0) {
    return;
  }

  const headers = Object.keys(issues[0]);
  const rows = [
    headers.join("\t"),
    ...issues.map((row) => headers.map((field) => row[field] ?? "").join("\t")),
  ];
  const excelContent = rows.join("\n");

  const blob = new Blob([excelContent], {
    type: "application/vnd.ms-excel",
  });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();
};
