"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Download,
  FileSpreadsheet,
  Loader2,
  Users,
} from "lucide-react";
import { useLeadsList } from "./hooks/useLeadsList";
import LeadsTableFilters from "./components/LeadsTableFilters";
import LeadsTable from "./components/LeadsTable";

export default function LeadsPage() {
  const {
    leads,
    totalItems,
    loading,
    error,
    search,
    startDate,
    endDate,
    currentPage,
    pageSize,
    ordering,
    noDuplicates,
    exportLoading,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleOrderingChange,
    handleDateRangeChange,
    handleNoDuplicatesChange,
    resetFilters,
    exportCurrentPageToExcel,
    exportAllToExcel,
  } = useLeadsList();

  // Crear objeto ResponseLeads para pasar a la tabla
  const responseData =
    leads.length > 0
      ? {
          count: totalItems,
          next: currentPage * pageSize < totalItems ? true : null,
          previous: currentPage > 1 ? true : null,
          results: leads,
        }
      : null;

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Leads
          </h1>
          <p className="text-muted-foreground">
            Lista de contactos recibidos desde el sitio web
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            onClick={exportCurrentPageToExcel}
            disabled={loading || leads.length === 0}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar página actual
          </Button>

          <Button
            variant="default"
            className="flex-1 md:flex-none"
            onClick={exportAllToExcel}
            disabled={loading || exportLoading || totalItems === 0}
          >
            {exportLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar todos
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <LeadsTableFilters
          search={search}
          onSearchChange={handleSearchChange}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          ordering={ordering}
          onOrderingChange={handleOrderingChange}
          noDuplicates={noDuplicates}
          onNoDuplicatesChange={handleNoDuplicatesChange}
          onResetFilters={resetFilters}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <LeadsTable
          data={responseData}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
