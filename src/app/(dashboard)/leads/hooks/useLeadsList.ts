import { getLeads } from "@/lib/actions/leads/leadAction";
import { ResponseLeads } from "@/types/lead/lead.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  exportAllLeadsToExcel,
  exportLeadsToExcel,
} from "../utils/exportLeadsToExcel";

interface UseLeadsListProps {
  initialPage?: number;
  initialPageSize?: number;
}

export function useLeadsList({
  initialPage = 1,
  initialPageSize = 50,
}: UseLeadsListProps = {}) {
  const [data, setData] = useState<ResponseLeads | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [ordering, setOrdering] = useState<string>("-created_at"); // Descendente por defecto
  const [noDuplicates, setNoDuplicates] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir parámetros según la estructura de la API de Django
      const params: Record<string, unknown> = {
        page: currentPage,
        page_size: pageSize,
        ordering: ordering,
      };

      // Añadir filtros opcionales solo si tienen valor
      if (search) params.search = search;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (noDuplicates) params.no_duplicates = "true";

      const result = await getLeads(params);
      setData(result);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("No se pudieron cargar los leads");
      toast.error("Error al cargar los leads");
    } finally {
      setLoading(false);
    }
  }, [
    search,
    startDate,
    endDate,
    currentPage,
    pageSize,
    ordering,
    noDuplicates,
  ]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleOrderingChange = (value: string) => {
    setOrdering(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (start?: string, end?: string) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);
  };

  const handleNoDuplicatesChange = (value: boolean) => {
    setNoDuplicates(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setStartDate(undefined);
    setEndDate(undefined);
    setOrdering("-created_at");
    setNoDuplicates(false);
    setCurrentPage(1);
  };

  // Exportar la página actual de leads a Excel
  const exportCurrentPageToExcel = useCallback(() => {
    if (data?.results && data.results.length > 0) {
      try {
        exportLeadsToExcel(data.results, "leads-pagina-actual");
        toast.success("Leads exportados correctamente");
      } catch (err) {
        console.error("Error al exportar leads:", err);
        toast.error("Error al exportar leads");
      }
    } else {
      toast.warning("No hay datos para exportar");
    }
  }, [data]);

  // Exportar todos los leads con los filtros actuales
  const exportAllToExcel = useCallback(async () => {
    try {
      setExportLoading(true);

      // Construir parámetros actuales
      const currentParams: Record<string, unknown> = {
        page: currentPage,
        page_size: pageSize,
        ordering: ordering,
      };

      if (search) currentParams.search = search;
      if (startDate) currentParams.start_date = startDate;
      if (endDate) currentParams.end_date = endDate;
      if (noDuplicates) currentParams.no_duplicates = "true";

      const success = await exportAllLeadsToExcel(getLeads, currentParams);

      if (success) {
        toast.success("Todos los leads exportados correctamente");
      } else {
        toast.error("Error al exportar todos los leads");
      }
    } catch (err) {
      console.error("Error al exportar todos los leads:", err);
      toast.error("Error al exportar todos los leads");
    } finally {
      setExportLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    ordering,
    search,
    startDate,
    endDate,
    noDuplicates,
  ]);

  // Cálculos para paginación
  const totalItems = data?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = data?.next !== null;
  const hasPreviousPage = data?.previous !== null;

  return {
    leads: data?.results || [],
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    loading,
    error,
    search,
    startDate,
    endDate,
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
    refresh: fetchLeads,
    exportCurrentPageToExcel,
    exportAllToExcel,
  };
}
