"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Search, Mail, Phone, Building } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ResponseLeads } from "@/types/lead/lead.types";
import { Button } from "@/components/ui/button";

interface LeadsTableProps {
  data: ResponseLeads | null;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: number) => void;
}

export default function LeadsTable({
  data,
  loading,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: LeadsTableProps) {
  const renderLoading = () => (
    <TableRow>
      <TableCell colSpan={6} className="h-96 text-center">
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Cargando leads...</p>
        </div>
      </TableCell>
    </TableRow>
  );

  const renderEmpty = () => (
    <TableRow>
      <TableCell colSpan={6} className="h-96 text-center">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No se encontraron leads</h3>
          <p className="text-muted-foreground mb-4">
            No hay leads que coincidan con los criterios de búsqueda.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: es });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Listado de Leads
          </CardTitle>
          {data && !loading && (
            <Badge variant="outline" className="font-normal">
              {data.count} {data.count === 1 ? "resultado" : "resultados"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/30">
                <TableHead className="font-medium">Información</TableHead>
                <TableHead className="font-medium">Contacto</TableHead>
                <TableHead className="font-medium">Mensaje</TableHead>
                <TableHead className="font-medium">Proyecto</TableHead>
                <TableHead className="font-medium">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? renderLoading()
                : data?.results && data.results.length > 0
                ? data.results.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {lead.first_name} {lead.last_name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-xs">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.email && (
                            <div className="flex items-center gap-1 text-xs">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate max-w-[130px]">
                                {lead.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate text-sm">
                          {lead.message || (
                            <span className="text-muted-foreground text-xs">
                              Sin mensaje
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.project_name ? (
                          <div className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5 text-primary" />
                            <span className="text-sm">{lead.project_name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No especificado
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(lead.created_at.toString())}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(lead.created_at.toString())}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : renderEmpty()}
            </TableBody>
          </Table>
        </div>
        {data && !loading && data.results.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 border-t">
            <div className="flex items-center space-x-4">
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                {[30, 50, 100, 200].map((value) => (
                  <option key={value} value={value}>
                    {value} por página
                  </option>
                ))}
              </select>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">
                  Total:{" "}
                  <span className="font-medium text-foreground">
                    {data.count}
                  </span>{" "}
                  resultados
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={!data.previous}
                className="h-8"
              >
                Primera
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!data.previous}
                className="h-8"
              >
                Anterior
              </Button>
              <div className="flex items-center text-sm px-2">
                <span className="text-muted-foreground">
                  Página{" "}
                  <span className="font-medium text-foreground">
                    {currentPage}
                  </span>
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!data.next}
                className="h-8"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
