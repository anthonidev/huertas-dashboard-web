import * as XLSX from "xlsx";
import { Leads, ResponseLeads } from "@/types/lead/lead.types";

export function exportLeadsToExcel(
  leads: Leads[],
  fileName: string = "leads-data"
) {
  const worksheetData = leads.map((lead) => ({
    Nombre: lead.first_name,
    Apellido: lead.last_name,
    Email: lead.email,
    Teléfono: lead.phone,
    Mensaje: lead.message,
    Proyecto: lead.project_name || "No especificado",
    Fecha: new Date(lead.created_at).toLocaleString("es-ES"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  const columnWidths = [
    { wch: 15 },
    { wch: 15 },
    { wch: 25 },
    { wch: 15 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
  ];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export async function exportAllLeadsToExcel(
  fetchFunction: (params: Record<string, unknown>) => Promise<ResponseLeads>,
  currentFilters: Record<string, unknown>
) {
  try {
    const { page, page_size, ...filters } = currentFilters; // Eliminamos las variables no utilizadas

    console.log("Exportando todos los leads...", page, page_size);

    const response = await fetchFunction({
      ...filters,
      page_size: 1000,
    });

    let allLeads = [...response.results];
    let nextPage = response.next;

    while (nextPage) {
      const nextUrl = new URL(nextPage.toString());
      const pageNumber = nextUrl.searchParams.get("page");

      if (!pageNumber) break;

      const nextResponse = await fetchFunction({
        ...filters,
        page: parseInt(pageNumber, 10),
        page_size: 1000,
      });

      allLeads = [...allLeads, ...nextResponse.results];
      nextPage = nextResponse.next;
    }

    exportLeadsToExcel(allLeads, "todos-los-leads");

    return true;
  } catch (error) {
    console.error("Error al exportar leads:", error);
    return false;
  }
}
